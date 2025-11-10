import { Test, TestingModule } from '@nestjs/testing';
import { FireblocksAuthService } from '../../src/transactions/fireblocks-auth.service';
import { AppConfigService } from '../../src/config/config.service';

describe('FireblocksAuthService', () => {
  let service: FireblocksAuthService;
  let configService: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FireblocksAuthService,
        {
          provide: AppConfigService,
          useValue: {
            fireblocksApiKey: 'test-api-key',
            fireblocksApiSecret: 'test-api-secret',
          },
        },
      ],
    }).compile();

    service = module.get<FireblocksAuthService>(FireblocksAuthService);
    configService = module.get<AppConfigService>(AppConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateJwtToken', () => {
    it('should generate a JWT token with Bearer prefix', () => {
      const token = service.generateJwtToken('/v1/transactions', '{}');

      expect(token).toBeDefined();
      expect(token).toContain('Bearer ');
    });

    it('should include path in token generation', () => {
      const token1 = service.generateJwtToken('/v1/transactions', '{}');
      const token2 = service.generateJwtToken('/v1/other', '{}');

      // Tokens should be different for different paths
      expect(token1).not.toBe(token2);
    });

    it('should include body hash in token generation', () => {
      const token1 = service.generateJwtToken('/v1/transactions', '{"test": 1}');
      const token2 = service.generateJwtToken('/v1/transactions', '{"test": 2}');

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

    it('should return empty string if API key is not configured', async () => {
      const moduleWithoutKey: TestingModule = await Test.createTestingModule({
        providers: [
          FireblocksAuthService,
          {
            provide: AppConfigService,
            useValue: {
              fireblocksApiKey: '',
              fireblocksApiSecret: '',
            },
          },
        ],
      }).compile();

      const serviceWithoutKey = moduleWithoutKey.get<FireblocksAuthService>(
        FireblocksAuthService,
      );

      const apiKey = serviceWithoutKey.getApiKey();
      expect(apiKey).toBe('');
    });
  });
});
