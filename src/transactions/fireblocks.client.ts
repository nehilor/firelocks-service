import { Injectable, HttpException, HttpStatus, OnModuleInit } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import { Fireblocks, BasePath } from '@fireblocks/ts-sdk';
import {
  FireblocksCreateTransactionRequest,
  FireblocksTransactionResponse,
} from './interfaces/fireblocks-transaction.interface';

@Injectable()
export class FireblocksClient implements OnModuleInit {
  private fireblocks: Fireblocks;

  constructor(private readonly configService: AppConfigService) {}

  onModuleInit() {
    // Initialize Fireblocks SDK
    const apiKey = this.configService.fireblocksApiKey;
    const apiSecret = this.configService.getFireblocksPrivateKey();

    if (!apiKey) {
      throw new Error('FIREBLOCKS_API_KEY is not configured');
    }

    if (!apiSecret) {
      throw new Error('FIREBLOCKS_SECRET_KEY_PATH is not configured or file not found');
    }

    // Clean the private key (remove BOM, normalize whitespace)
    let cleanSecret = apiSecret;
    if (cleanSecret.charCodeAt(0) === 0xfeff) {
      cleanSecret = cleanSecret.slice(1);
    }
    cleanSecret = cleanSecret.trim();
    cleanSecret = cleanSecret.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Initialize SDK with configuration object
    // Determine basePath from environment or default to US (Production)
    const baseUrl = this.configService.fireblocksBaseUrl;
    let basePath = BasePath.US; // Default to US (Production)

    if (baseUrl.includes('sandbox')) {
      basePath = BasePath.Sandbox;
    } else if (baseUrl.includes('eu1') || baseUrl.includes('eu')) {
      basePath = BasePath.EU;
    } else if (baseUrl.includes('eu2')) {
      basePath = BasePath.EU2;
    }

    this.fireblocks = new Fireblocks({
      apiKey: apiKey,
      secretKey: cleanSecret,
      basePath: basePath,
    });
  }

  async createTransaction(
    transactionData: FireblocksCreateTransactionRequest,
  ): Promise<FireblocksTransactionResponse> {
    try {
      // Use Fireblocks SDK to create transaction
      // The SDK handles authentication automatically
      const result = await this.fireblocks.transactions.createTransaction({
        transactionRequest: transactionData as any, // Type assertion for compatibility
      });

      // Map SDK response to our interface
      // SDK returns FireblocksResponse<CreateTransactionResponse>, access via .data
      const transaction = result.data;
      return {
        id: transaction.id || '',
        status: transaction.status || '',
        systemMessages: transaction.systemMessages
          ? {
              type: transaction.systemMessages.type || '',
              message: transaction.systemMessages.message || '',
            }
          : undefined,
      };
    } catch (error: unknown) {
      // Handle Fireblocks SDK errors
      if (error && typeof error === 'object' && 'response' in error) {
        const sdkError = error as {
          response?: {
            data?: { message?: string; code?: number };
            status?: number;
          };
        };

        const errorData = sdkError.response?.data;
        const statusCode = sdkError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;

        // Handle authentication errors
        if (errorData?.code === -7 || errorData?.code === -1) {
          throw new HttpException(
            {
              message: errorData.message || 'Fireblocks authentication failed',
              code: errorData.code,
              details: {
                ...errorData,
                troubleshooting: [
                  'Verify that the FIREBLOCKS_API_KEY in your .env file matches the API key associated with your private key file',
                  'Ensure the private key file (fireblocks_secret.key) is the one downloaded for this specific API key',
                  'Check that the private key file is in PEM format and properly formatted',
                ],
              },
            },
            HttpStatus.UNAUTHORIZED,
          );
        }

        throw new HttpException(
          {
            message: errorData?.message || 'Fireblocks API error',
            code: errorData?.code,
            details: errorData,
          },
          statusCode >= 500 ? HttpStatus.BAD_GATEWAY : statusCode,
        );
      } else if (error instanceof Error) {
        throw new HttpException(
          {
            message: error.message,
            code: 'REQUEST_ERROR',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          {
            message: 'Failed to create transaction',
            code: 'UNKNOWN_ERROR',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
