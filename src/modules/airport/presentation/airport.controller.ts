import { Controller, Get, Param, Query, Inject } from '@nestjs/common';
import { AirportService, AIRPORT_TOKENS } from '../application';
import { PaginationDto } from '../../../shared/presentation';
import { AirportResponseDto } from './airport-response.dto';
import { AirportMapper } from './airport.mapper';

@Controller('airports')
export class AirportController {
  constructor(
    @Inject(AIRPORT_TOKENS.AIRPORT_SERVICE)
    private readonly airportService: AirportService,
  ) {}

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const paginationOptions = {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder || ('ASC' as const),
    };

    const result = await this.airportService.findAll(paginationOptions);
    return {
      ...result,
      data: AirportMapper.toResponseDtoList(result.data),
    };
  }

  @Get(':code')
  async findByCode(@Param('code') code: string): Promise<AirportResponseDto> {
    const airport = await this.airportService.findByCode(code);
    return AirportMapper.toResponseDto(airport);
  }
}
