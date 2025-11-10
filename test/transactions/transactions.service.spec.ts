import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from '../../src/transactions/transactions.service';
import { FireblocksClient } from '../../src/transactions/fireblocks.client';
import { CreateTransactionDto } from '../../src/transactions/dto/create-transaction.dto';
import { FireblocksTransactionResponse } from '../../src/transactions/interfaces/fireblocks-transaction.interface';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let fireblocksClient: FireblocksClient;

  const mockTransactionResponse: FireblocksTransactionResponse = {
    id: 'test-transaction-id',
    status: 'SUBMITTED',
  };

  const mockCreateTransactionDto: CreateTransactionDto = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: FireblocksClient,
          useValue: {
            createTransaction: jest
              .fn()
              .mockResolvedValue(mockTransactionResponse),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    fireblocksClient = module.get<FireblocksClient>(FireblocksClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction via FireblocksClient', async () => {
      const result = await service.createTransaction(mockCreateTransactionDto);

      expect(fireblocksClient.createTransaction).toHaveBeenCalled();
      expect(result).toEqual(mockTransactionResponse);
    });

    it('should map DTO fields correctly', async () => {
      await service.createTransaction(mockCreateTransactionDto);

      const callArgs = (fireblocksClient.createTransaction as jest.Mock).mock
        .calls[0][0];

      expect(callArgs.assetId).toBe(mockCreateTransactionDto.assetId);
      expect(callArgs.source).toEqual(mockCreateTransactionDto.source);
      expect(callArgs.destination).toEqual(mockCreateTransactionDto.destination);
      expect(callArgs.amount).toBe(mockCreateTransactionDto.amount);
      expect(callArgs.feeLevel).toBe(mockCreateTransactionDto.feeLevel);
      expect(callArgs.note).toBe(mockCreateTransactionDto.note);
      expect(callArgs.operation).toBe(mockCreateTransactionDto.operation);
      expect(callArgs.customerRefId).toBe(
        mockCreateTransactionDto.customerRefId,
      );
      expect(callArgs.externalTxId).toBe(
        mockCreateTransactionDto.externalTxId,
      );
    });

    it('should use default values when optional fields are not provided', async () => {
      const dtoWithoutOptionals: CreateTransactionDto = {
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
      };

      await service.createTransaction(dtoWithoutOptionals);

      const callArgs = (fireblocksClient.createTransaction as jest.Mock).mock
        .calls[0][0];

      expect(callArgs.feeLevel).toBe('MEDIUM');
      expect(callArgs.note).toBe('');
      expect(callArgs.operation).toBe('TRANSFER');
    });

    it('should handle FireblocksClient errors', async () => {
      const error = new Error('Fireblocks API error');
      jest
        .spyOn(fireblocksClient, 'createTransaction')
        .mockRejectedValue(error);

      await expect(
        service.createTransaction(mockCreateTransactionDto),
      ).rejects.toThrow(error);
    });
  });
});
