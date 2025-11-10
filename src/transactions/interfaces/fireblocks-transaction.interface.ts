export interface FireblocksSource {
  type: string;
  id: string;
  subType?: string;
  name?: string;
  walletId?: string;
  isCollateral?: boolean;
}

export interface FireblocksDestination {
  type: string;
  id: string;
  subType?: string;
  name?: string;
  walletId?: string;
  oneTimeAddress?: {
    address: string;
    tag?: string;
  };
  isCollateral?: boolean;
}

export interface FireblocksCreateTransactionRequest {
  assetId: string;
  source: FireblocksSource;
  destination?: FireblocksDestination;
  amount: string;
  feeLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  note?: string;
  operation?: string;
  customerRefId?: string;
  externalTxId?: string;
  destinations?: Array<{
    amount: string;
    destination: FireblocksDestination;
    travelRuleMessageId?: string;
    customerRefId?: string;
  }>;
  treatAsGrossAmount?: boolean;
  forceSweep?: boolean;
  fee?: string;
  priorityFee?: string;
  failOnLowFee?: boolean;
  maxFee?: string;
  maxTotalFee?: string;
  gasLimit?: string;
  gasPrice?: string;
  networkFee?: string;
  replaceTxByHash?: string;
  extraParameters?: Record<string, unknown>;
  travelRuleMessage?: Record<string, unknown>;
  travelRuleMessageId?: string;
  autoStaking?: boolean;
  networkStaking?: string;
  cpuStaking?: string;
  useGasless?: boolean;
}

export interface FireblocksTransactionResponse {
  id: string;
  status: string;
  systemMessages?: {
    type: string;
    message: string;
  };
}

export interface FireblocksErrorResponse {
  message: string;
  code: number;
}
