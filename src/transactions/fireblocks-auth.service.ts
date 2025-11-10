import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class FireblocksAuthService {
  private privateKey: string | null = null;

  constructor(private configService: AppConfigService) {}

  /**
   * Gets the private key, loading it if necessary
   * Cleans the key by removing BOM, normalizing whitespace, and ensuring proper PEM format
   */
  private getPrivateKey(): string {
    if (!this.privateKey) {
      try {
        let rawKey = this.configService.getFireblocksPrivateKey();

        // Remove BOM (Byte Order Mark) if present
        if (rawKey.charCodeAt(0) === 0xfeff) {
          rawKey = rawKey.slice(1);
        }

        // Trim whitespace from start and end
        rawKey = rawKey.trim();

        // Normalize line endings to \n (remove \r)
        rawKey = rawKey.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // Ensure proper PEM format - remove any extra blank lines
        rawKey = rawKey.replace(/\n{3,}/g, '\n\n');

        this.privateKey = rawKey;
      } catch (error) {
        throw new Error(
          `Failed to load Fireblocks private key: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }
    return this.privateKey;
  }

  /**
   * Generates JWT token for Fireblocks API authentication
   * Based on Fireblocks JWT authentication scheme
   *
   * The JWT is signed using RS256 with the private key from the secret key file.
   * According to Fireblocks documentation:
   * - uri: must match the exact API path (e.g., '/v1/transactions')
   * - bodyHash: SHA256 hash of the request body (empty string for GET requests)
   * - sub: the API key (user ID)
   *
   * @param path - API path (e.g., '/v1/transactions')
   * @param body - Request body as string
   * @returns JWT token string with Bearer prefix
   */
  generateJwtToken(path: string, body: string = ''): string {
    const apiKey = this.configService.fireblocksApiKey;

    if (!apiKey) {
      throw new Error('FIREBLOCKS_API_KEY is not configured');
    }

    // JWT Payload according to Fireblocks specification
    const now = Math.floor(Date.now() / 1000);

    // Calculate bodyHash - SHA256 of the body string (even if empty)
    const bodyHash = crypto
      .createHash('sha256')
      .update(body || '', 'utf8')
      .digest('hex');

    const payload = {
      uri: path,
      nonce: crypto.randomBytes(16).toString('hex'),
      iat: now,
      exp: now + 30, // 30 seconds expiration
      sub: apiKey,
      bodyHash: bodyHash,
    };

    try {
      const privateKey = this.getPrivateKey();

      // Verify the private key format
      if (
        !privateKey.includes('BEGIN') ||
        !privateKey.includes('PRIVATE KEY')
      ) {
        throw new Error(
          'Invalid private key format. Expected PEM format with BEGIN/END markers.',
        );
      }

      // Sign the JWT using RS256 algorithm
      const token = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
      });

      return `Bearer ${token}`;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error(
          `JWT signing failed: ${error.message}. Please verify your private key is correct and matches your API key.`,
        );
      }
      throw new Error(
        `Failed to generate JWT token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Gets the API key for X-API-Key header
   */
  getApiKey(): string {
    const apiKey = this.configService.fireblocksApiKey;
    if (!apiKey) {
      throw new Error('FIREBLOCKS_API_KEY is not configured');
    }
    return apiKey;
  }
}
