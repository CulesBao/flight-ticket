import {
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FlightSearchDto {
  @ApiPropertyOptional({ example: 'SGN' })
  @IsOptional()
  @IsString()
  departureAirport?: string;

  @ApiPropertyOptional({ example: 'HAN' })
  @IsOptional()
  @IsString()
  arrivalAirport?: string;

  @ApiPropertyOptional({ example: '2025-07-17' })
  @IsOptional()
  @IsDateString()
  departureDate?: string;

  @ApiPropertyOptional({ example: 1000000 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
