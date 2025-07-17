import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  Min,
  Max,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MoneyDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currency: string;
}

export class CreateSeatDto {
  @IsString()
  flightId: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  row: number;

  @IsString()
  column: string;

  @IsEnum(['economy', 'premium_economy', 'business', 'first'])
  seatClass: string;

  @IsEnum(['window', 'middle', 'aisle'])
  seatType: string;

  @IsOptional()
  @IsArray()
  @IsEnum(
    [
      'extra_legroom',
      'power_outlet',
      'wifi',
      'meal_service',
      'priority_boarding',
    ],
    { each: true },
  )
  features?: string[];

  @ValidateNested()
  @Type(() => MoneyDto)
  @IsObject()
  basePrice: MoneyDto;
}

export class ReserveSeatDto {
  @IsString()
  userId: string;
}

export class GenerateSeatsDto {
  @IsString()
  flightId: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  totalRows: number;

  @IsArray()
  @IsString({ each: true })
  columnsPerRow: string[];

  @IsObject()
  economyRows: { start: number; end: number };

  @IsOptional()
  @IsObject()
  premiumEconomyRows?: { start: number; end: number };

  @IsOptional()
  @IsObject()
  businessRows?: { start: number; end: number };

  @IsOptional()
  @IsObject()
  firstRows?: { start: number; end: number };

  @ValidateNested()
  @Type(() => MoneyDto)
  @IsObject()
  basePrice: MoneyDto;
}

export class SeatQueryDto {
  @IsOptional()
  @IsEnum(['economy', 'premium_economy', 'business', 'first'])
  seatClass?: string;

  @IsOptional()
  @IsEnum(['available', 'reserved', 'occupied', 'blocked'])
  status?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
