import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ReturnDebtDto {
    @IsNumber()
    @ApiProperty({ example: 100, description: 'Amount to return (subtract from debt)' })
    moneyDebt: number;
  }