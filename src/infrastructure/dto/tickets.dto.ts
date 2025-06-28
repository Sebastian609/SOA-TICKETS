import { Expose } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
} from "class-validator";

export class CreateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  eventLocationId: number;
}

export class UpdateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  eventLocationId?: number;

  @IsString()
  @IsOptional()
  @Expose()
  code?: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  isUsed?: boolean;

  @Expose()
  @IsDateString()
  @IsOptional()
  usedAt?: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UseTicketDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  code: string;
}

export class GenerateTicketsDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  eventLocationId: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  quantity: number;
}
