import { Injectable, BadRequestException } from '@nestjs/common';
import { FireblocksClient } from './fireblocks.client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  FireblocksCreateTransactionRequest,
  FireblocksTransactionResponse,
} from './interfaces/fireblocks-transaction.interface';

@Injectable()
export class TransactionsService {
  constructor(private readonly fireblocksClient: FireblocksClient) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<FireblocksTransactionResponse> {
    // Validate that either destination or destinations is provided
    if (
      !createTransactionDto.destination &&
      !createTransactionDto.destinations
    ) {
      throw new BadRequestException(
        'Either destination or destinations must be provided',
      );
    }

    // Map DTO to Fireblocks request format
    const fireblocksRequest: FireblocksCreateTransactionRequest = {
      assetId: createTransactionDto.assetId,
      source: createTransactionDto.source,
      amount: createTransactionDto.amount,
      feeLevel: createTransactionDto.feeLevel || 'MEDIUM',
      note: createTransactionDto.note || '',
      operation: createTransactionDto.operation || 'TRANSFER',
      customerRefId: createTransactionDto.customerRefId,
      externalTxId: createTransactionDto.externalTxId,
    };

    // Add destination if provided
    if (createTransactionDto.destination) {
      fireblocksRequest.destination = createTransactionDto.destination;
    }

    // Add destinations array if provided
    if (createTransactionDto.destinations) {
      fireblocksRequest.destinations = createTransactionDto.destinations;
    }

    // Add optional fields
    if (createTransactionDto.treatAsGrossAmount !== undefined) {
      fireblocksRequest.treatAsGrossAmount =
        createTransactionDto.treatAsGrossAmount;
    }
    if (createTransactionDto.forceSweep !== undefined) {
      fireblocksRequest.forceSweep = createTransactionDto.forceSweep;
    }
    if (createTransactionDto.fee) {
      fireblocksRequest.fee = createTransactionDto.fee;
    }
    if (createTransactionDto.priorityFee) {
      fireblocksRequest.priorityFee = createTransactionDto.priorityFee;
    }
    if (createTransactionDto.failOnLowFee !== undefined) {
      fireblocksRequest.failOnLowFee = createTransactionDto.failOnLowFee;
    }
    if (createTransactionDto.maxFee) {
      fireblocksRequest.maxFee = createTransactionDto.maxFee;
    }
    if (createTransactionDto.maxTotalFee) {
      fireblocksRequest.maxTotalFee = createTransactionDto.maxTotalFee;
    }
    if (createTransactionDto.gasLimit) {
      fireblocksRequest.gasLimit = createTransactionDto.gasLimit;
    }
    if (createTransactionDto.gasPrice) {
      fireblocksRequest.gasPrice = createTransactionDto.gasPrice;
    }
    if (createTransactionDto.networkFee) {
      fireblocksRequest.networkFee = createTransactionDto.networkFee;
    }
    if (createTransactionDto.replaceTxByHash) {
      fireblocksRequest.replaceTxByHash = createTransactionDto.replaceTxByHash;
    }
    if (createTransactionDto.extraParameters) {
      fireblocksRequest.extraParameters = createTransactionDto.extraParameters;
    }
    if (createTransactionDto.travelRuleMessage) {
      fireblocksRequest.travelRuleMessage =
        createTransactionDto.travelRuleMessage;
    }
    if (createTransactionDto.travelRuleMessageId) {
      fireblocksRequest.travelRuleMessageId =
        createTransactionDto.travelRuleMessageId;
    }
    if (createTransactionDto.autoStaking !== undefined) {
      fireblocksRequest.autoStaking = createTransactionDto.autoStaking;
    }
    if (createTransactionDto.networkStaking) {
      fireblocksRequest.networkStaking = createTransactionDto.networkStaking;
    }
    if (createTransactionDto.cpuStaking) {
      fireblocksRequest.cpuStaking = createTransactionDto.cpuStaking;
    }
    if (createTransactionDto.useGasless !== undefined) {
      fireblocksRequest.useGasless = createTransactionDto.useGasless;
    }

    return this.fireblocksClient.createTransaction(fireblocksRequest);
  }
}
