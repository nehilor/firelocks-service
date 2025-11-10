import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from '../../src/transactions/transactions.controller';
import { TransactionsService } from '../../src/transactions/transactions.service';
import { CreateTransactionDto } from '../../src/transactions/dto/create-transaction.dto';
import { FireblocksTransactionResponse } from '../../src/transactions/interfaces/fireblocks-transaction.interface';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

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
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            createTransaction: jest
              .fn()
              .mockResolvedValue(mockTransactionResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction and return the response', async () => {
      const result = await controller.createTransaction(mockCreateTransactionDto);

      expect(service.createTransaction).toHaveBeenCalledWith(
        mockCreateTransactionDto,
      );
      expect(result).toEqual(mockTransactionResponse);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'createTransaction').mockRejectedValue(error);

      await expect(
        controller.createTransaction(mockCreateTransactionDto),
      ).rejects.toThrow(error);
    });
  });
});
