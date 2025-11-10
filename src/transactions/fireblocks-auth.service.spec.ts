import { Test, TestingModule } from '@nestjs/testing';
import { FireblocksAuthService } from './fireblocks-auth.service';
import { AppConfigService } from '../config/config.service';

// Mock private key for testing (valid RSA private key in PEM format)
const mockPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEpAIBAAKCAQEAy7X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
QwIDAQABAoIBAQC8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
AoGBAP8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
AoGBAQC8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
AoGBAL8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
AoGBAQC8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
AoGBAL8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKVC0nF4XELdcLlg
6Lzxj2qRzZ3xxf/FXLh9dtfqoK+rDnHhKtiBv7b6c49typdYXlZHdFAnblJxetUJ
mZ4IBwfPBGF9tYxWYqyMxQinUWgezGlAAqmnSRi67BfpNWVd/V5tt/hkM82kAHZj
TAWV+HLfQswBMF8UogJC6nSdR9NPAgMBAAECgYBkLWiB7jMHOVKunQcYGdoVAMNC
nh+nFs1I7I0Q/6JeOnPsJlEhoy1CzvkkFaq8KY4uAOyJ9g0THsUVxNcBC96uLHJ1
ihq1nBmpLanloOVXhFq8qNMbWCcZrXpLNIgmPWQI6PZUrC4/esIZmwE02dVrpRcj
cx1oyrkRCfSs0MHOyQJBANesdYfyZ5OoCPBlwxQknUdduQoXYh6AJWUvW8z5se5J
TDJifcB25rmxnjWM2LdKT1/UuZR/JV1KZhbkJA/o/W0CQQDEKUlmiWnwIbB/J5gK
M7Dx9EP3q/W0/OCQ+hivhV62vxuZ8V/Kakky5UvQtA9yRXqZBt/lTHlz5oNmsu5X
2worAkEAqAWadvP5j4Y8mJSe+yVfRocUrnDzJxHskDzqBvGMljiSXTpv/65iJ87h
k5SMDZed6OnAPpkjkd9xU2ofUinQrQJALjCqoAJrd6f3L3nbS0uwtsiV2JQdX2jM
WFcLyQjWrKGDllRIAhnU8q8bkyFTIc1KeQ4tWokPcEMvXdd0WCuz0QJAVJapJ9GE
u0xrvV3Y26tTLUgDXWqUJ2k7v29Bz90DA7P02QIlbyboYUxFVgbAIHHMGO8ByGHv
YmQAhDj3Ov3YzA==
-----END PRIVATE KEY-----`;

describe('FireblocksAuthService', () => {
  let service: FireblocksAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FireblocksAuthService,
        {
          provide: AppConfigService,
          useValue: {
            fireblocksApiKey: 'test-api-key',
            getFireblocksPrivateKey: jest.fn().mockReturnValue(mockPrivateKey),
          },
        },
      ],
    }).compile();

    service = module.get<FireblocksAuthService>(FireblocksAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateJwtToken', () => {
    it('should generate a JWT token with Bearer prefix', () => {
      const token = service.generateJwtToken('/v1/transactions', '{}');

      expect(token).toBeDefined();
      expect(token).toContain('Bearer ');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should include path in token generation', () => {
      const token1 = service.generateJwtToken('/v1/transactions', '{}');
      const token2 = service.generateJwtToken('/v1/other', '{}');

      // Tokens should be different for different paths
      expect(token1).not.toBe(token2);
    });

    it('should include body hash in token generation', () => {
      const token1 = service.generateJwtToken(
        '/v1/transactions',
        '{"test": 1}',
      );
      const token2 = service.generateJwtToken(
        '/v1/transactions',
        '{"test": 2}',
      );

      // Tokens should be different for different bodies
      expect(token1).not.toBe(token2);
    });

    it('should handle empty body', () => {
      const token = service.generateJwtToken('/v1/transactions', '');

      expect(token).toBeDefined();
      expect(token).toContain('Bearer ');
    });
  });

  describe('getApiKey', () => {
    it('should return the API key from config', () => {
      const apiKey = service.getApiKey();

      expect(apiKey).toBe('test-api-key');
    });

    it('should throw error if API key is not configured', async () => {
      const moduleWithoutKey: TestingModule = await Test.createTestingModule({
        providers: [
          FireblocksAuthService,
          {
            provide: AppConfigService,
            useValue: {
              fireblocksApiKey: '',
              getFireblocksPrivateKey: jest.fn().mockReturnValue(mockPrivateKey),
            },
          },
        ],
      }).compile();

      const serviceWithoutKey = moduleWithoutKey.get<FireblocksAuthService>(
        FireblocksAuthService,
      );

      expect(() => serviceWithoutKey.getApiKey()).toThrow(
        'FIREBLOCKS_API_KEY is not configured',
      );
    });
  });
});
