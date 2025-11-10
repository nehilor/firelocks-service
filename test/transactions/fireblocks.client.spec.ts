import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FireblocksClient } from '../../src/transactions/fireblocks.client';
import { AppConfigService } from '../../src/config/config.service';
import { FireblocksAuthService } from '../../src/transactions/fireblocks-auth.service';
import {
  FireblocksCreateTransactionRequest,
  FireblocksTransactionResponse,
} from '../../src/transactions/interfaces/fireblocks-transaction.interface';

describe('FireblocksClient', () => {
  let client: FireblocksClient;
  let httpService: HttpService;
  let configService: AppConfigService;
  let authService: FireblocksAuthService;

  const mockTransactionRequest: FireblocksCreateTransactionRequest = {
    assetId: 'XLM_USDC_T_CEKS',
    source: {
      type: 'EXCHANGE_ACCOUNT',
      id: '300d1b9a-f46b-4ee6-be99-659fcd3cd802',
    },
    destination: {
      type: 'EXTERNAL_WALLET',
      id: '56216a51-5fad-4433-ac89-d4416fad7c0d',
    },
    amount: '1',
    feeLevel: 'MEDIUM',
    note: '',
    operation: 'TRANSFER',
    customerRefId: 'payoutCircleExternal',
    externalTxId: 'circleTest',
  };

  const mockTransactionResponse: FireblocksTransactionResponse = {
    id: 'test-transaction-id',
    status: 'SUBMITTED',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FireblocksClient,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: AppConfigService,
          useValue: {
            fireblocksBaseUrl: 'https://api.fireblocks.io',
            fireblocksApiPath: '/v1',
          },
        },
        {
          provide: FireblocksAuthService,
          useValue: {
            getApiKey: jest.fn().mockReturnValue('test-api-key'),
            generateJwtToken: jest.fn().mockReturnValue('Bearer test-token'),
          },
        },
      ],
    }).compile();

    client = module.get<FireblocksClient>(FireblocksClient);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<AppConfigService>(AppConfigService);
    authService = module.get<FireblocksAuthService>(FireblocksAuthService);
  });

  it('should be defined', () => {
    expect(client).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should successfully create a transaction', async () => {
      jest.spyOn(httpService, 'post').mockReturnValue(
        of({
          data: mockTransactionResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        }),
      );

      const result = await client.createTransaction(mockTransactionRequest);

      expect(httpService.post).toHaveBeenCalledWith(
        'https://api.fireblocks.io/v1/transactions',
        mockTransactionRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-API-Key': 'test-api-key',
            Authorization: 'Bearer test-token',
          },
        },
      );
      expect(result).toEqual(mockTransactionResponse);
    });

    it('should handle Fireblocks API error responses', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: {
            message: 'Invalid transaction data',
            code: 1001,
          },
        },
      };

      jest.spyOn(httpService, 'post').mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        client.createTransaction(mockTransactionRequest),
      ).rejects.toThrow(HttpException);

      try {
        await client.createTransaction(mockTransactionRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(400);
        expect(error.response.message).toBe('Invalid transaction data');
        expect(error.response.code).toBe(1001);
      }
    });

    it('should handle network errors (no response)', async () => {
      const networkError = {
        request: {},
      };

      jest.spyOn(httpService, 'post').mockReturnValue(
        throwError(() => networkError),
      );

      await expect(
        client.createTransaction(mockTransactionRequest),
      ).rejects.toThrow(HttpException);

      try {
        await client.createTransaction(mockTransactionRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.BAD_GATEWAY);
        expect(error.response.message).toBe('No response from Fireblocks API');
      }
    });

    it('should handle 5xx errors as BAD_GATEWAY', async () => {
      const serverError = {
        response: {
          status: 500,
          data: {
            message: 'Internal server error',
            code: 5000,
          },
        },
      };

      jest.spyOn(httpService, 'post').mockReturnValue(
        throwError(() => serverError),
      );

      await expect(
        client.createTransaction(mockTransactionRequest),
      ).rejects.toThrow(HttpException);

      try {
        await client.createTransaction(mockTransactionRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.BAD_GATEWAY);
      }
    });

    it('should handle request setup errors', async () => {
      const setupError = {
        message: 'Request setup failed',
      };

      jest.spyOn(httpService, 'post').mockReturnValue(
        throwError(() => setupError),
      );

      await expect(
        client.createTransaction(mockTransactionRequest),
      ).rejects.toThrow(HttpException);

      try {
        await client.createTransaction(mockTransactionRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(error.response.message).toBe('Request setup failed');
      }
    });
  });
});
