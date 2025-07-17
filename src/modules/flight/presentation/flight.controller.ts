import { Controller, Get, Param, Query, Inject } from '@nestjs/common';
import { FlightService, FLIGHT_TOKENS } from '../application';
import { PaginationDto } from '../../../shared/presentation';
import { FlightResponseDto } from './flight-response.dto';
import { FlightSearchDto } from './flight-search.dto';
import { FlightMapper } from './flight.mapper';

@Controller('flights')
export class FlightController {
  constructor(
    @Inject(FLIGHT_TOKENS.FLIGHT_SERVICE)
    private readonly flightService: FlightService,
  ) {}

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const paginationOptions = {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder || 'ASC',
    };

    const result = await this.flightService.findAll(paginationOptions);
    return {
      ...result,
      data: FlightMapper.toResponseDtoList(result.data),
    };
  }

  @Get('search')
  async search(
    @Query() searchDto: FlightSearchDto,
  ): Promise<FlightResponseDto[]> {
    const criteria = {
      departureAirport: searchDto.departureAirport,
      arrivalAirport: searchDto.arrivalAirport,
      departureDate: searchDto.departureDate
        ? new Date(searchDto.departureDate)
        : undefined,
      minPrice: searchDto.minPrice,
      maxPrice: searchDto.maxPrice,
    };

    const flights = await this.flightService.searchFlights(criteria);
    return FlightMapper.toResponseDtoList(flights);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<FlightResponseDto> {
    const flight = await this.flightService.findById(id);
    return FlightMapper.toResponseDto(flight);
  }
}
