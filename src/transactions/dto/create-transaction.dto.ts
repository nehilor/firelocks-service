import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SourceDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  subType?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  walletId?: string;

  @IsOptional()
  isCollateral?: boolean;
}

export class OneTimeAddressDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  tag?: string;
}

export class DestinationDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  subType?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  walletId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OneTimeAddressDto)
  oneTimeAddress?: OneTimeAddressDto;

  @IsOptional()
  isCollateral?: boolean;
}

export class DestinationWithAmountDto {
  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DestinationDto)
  destination: DestinationDto;

  @IsString()
  @IsOptional()
  travelRuleMessageId?: string;

  @IsString()
  @IsOptional()
  customerRefId?: string;
}

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SourceDto)
  source: SourceDto;

  @IsObject()
  @ValidateNested()
  @Type(() => DestinationDto)
  @IsOptional()
  destination?: DestinationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DestinationWithAmountDto)
  @IsOptional()
  destinations?: DestinationWithAmountDto[];

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  @IsOptional()
  feeLevel?: 'LOW' | 'MEDIUM' | 'HIGH';

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  operation?: string;

  @IsString()
  @IsOptional()
  customerRefId?: string;

  @IsString()
  @IsOptional()
  externalTxId?: string;

  @IsOptional()
  treatAsGrossAmount?: boolean;

  @IsOptional()
  forceSweep?: boolean;

  @IsString()
  @IsOptional()
  fee?: string;

  @IsString()
  @IsOptional()
  priorityFee?: string;

  @IsOptional()
  failOnLowFee?: boolean;

  @IsString()
  @IsOptional()
  maxFee?: string;

  @IsString()
  @IsOptional()
  maxTotalFee?: string;

  @IsString()
  @IsOptional()
  gasLimit?: string;

  @IsString()
  @IsOptional()
  gasPrice?: string;

  @IsString()
  @IsOptional()
  networkFee?: string;

  @IsString()
  @IsOptional()
  replaceTxByHash?: string;

  @IsOptional()
  extraParameters?: Record<string, unknown>;

  @IsOptional()
  travelRuleMessage?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  travelRuleMessageId?: string;

  @IsOptional()
  autoStaking?: boolean;

  @IsString()
  @IsOptional()
  networkStaking?: string;

  @IsString()
  @IsOptional()
  cpuStaking?: string;

  @IsOptional()
  useGasless?: boolean;
}
