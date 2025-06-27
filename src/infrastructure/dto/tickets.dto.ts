import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, IsDateString } from "class-validator";

export class CreateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose({ name: "event_location_id" })
  eventLocationId: number;
}

export class UpdateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;

  @IsNumber()
  @IsOptional()
  @Expose({ name: "event_location_id" })
  eventLocationId?: number;

  @IsString()
  @IsOptional()
  @Expose()
  code?: string;

  @IsBoolean()
  @IsOptional()
  @Expose({ name: "is_used" })
  isUsed?: boolean;

  @IsDateString()
  @IsOptional()
  @Expose({ name: "used_at" })
  usedAt?: string;

  @IsBoolean()
  @IsOptional()
  @Expose({ name: "is_active" })
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
  @Expose({ name: "event_location_id" })
  eventLocationId: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  quantity: number;
} 