import { Controller, Get, Param, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AirportService, AIRPORT_TOKENS } from '../application';
import { PaginationDto } from '../../../shared/presentation';
import { AirportResponseDto } from './airport-response.dto';
import { AirportMapper } from './airport.mapper';

@ApiTags('airports')
@Controller('airports')
export class AirportController {
  constructor(
    @Inject(AIRPORT_TOKENS.AIRPORT_SERVICE)
    private readonly airportService: AirportService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all airports' })
  @ApiResponse({
    status: 200,
    description: 'List of airports retrieved successfully',
    type: [AirportResponseDto],
  })
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
  @ApiOperation({ summary: 'Get airport by code' })
  @ApiParam({ name: 'code', description: 'Airport code (3 characters)' })
  @ApiResponse({
    status: 200,
    description: 'Airport found',
    type: AirportResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Airport not found' })
  async findByCode(@Param('code') code: string): Promise<AirportResponseDto> {
    const airport = await this.airportService.findByCode(code);
    return AirportMapper.toResponseDto(airport);
  }
}
