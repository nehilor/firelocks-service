import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get fireblocksApiKey(): string {
    return this.configService.get<string>('FIREBLOCKS_API_KEY') || '';
  }

  get fireblocksSecretKeyPath(): string {
    return (
      this.configService.get<string>('FIREBLOCKS_SECRET_KEY_PATH') ||
      './fireblocks_secret.key'
    );
  }

  /**
   * Reads the private key from the file path
   * @returns The private key content as a string
   */
  getFireblocksPrivateKey(): string {
    const keyPath = this.fireblocksSecretKeyPath;
    const resolvedPath = path.isAbsolute(keyPath)
      ? keyPath
      : path.resolve(process.cwd(), keyPath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(
        `Fireblocks private key file not found at: ${resolvedPath}. Please check FIREBLOCKS_SECRET_KEY_PATH in your .env file.`,
      );
    }

    return fs.readFileSync(resolvedPath, 'utf-8');
  }

  get fireblocksBaseUrl(): string {
    return (
      this.configService.get<string>('FIREBLOCKS_BASE_URL') ||
      'https://api.fireblocks.io'
    );
  }

  get fireblocksApiPath(): string {
    return this.configService.get<string>('FIREBLOCKS_API_PATH') || '/v1';
  }
}
