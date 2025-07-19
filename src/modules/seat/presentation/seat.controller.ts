import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Inject,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeatService, SEAT_TOKENS } from '../application';
import { SeatClass, SeatType } from '../domain';
import { PaginationDto } from '../../../shared/presentation';
import {
  SeatResponseDto,
  SeatMapResponseDto,
  SeatStatisticsResponseDto,
} from './seat-response.dto';
import {
  CreateSeatDto,
  ReserveSeatDto,
  GenerateSeatsDto,
  SeatQueryDto,
} from './seat.dto';
import { SeatMapper } from './seat.mapper';

@ApiTags('seats')
@Controller('seats')
export class SeatController {
  constructor(
    @Inject(SEAT_TOKENS.SEAT_SERVICE)
    private readonly seatService: SeatService,
  ) {}

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const paginationOptions = {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder || 'ASC',
    };

    const result = await this.seatService.findAll(paginationOptions);
    return {
      ...result,
      data: SeatMapper.toResponseDtoList(result.data),
    };
  }

  @Get('flight/:flightId')
  async findByFlightId(
    @Param('flightId') flightId: string,
  ): Promise<SeatResponseDto[]> {
    const seats = await this.seatService.findByFlightId(flightId);
    return SeatMapper.toResponseDtoList(seats);
  }

  @Get('flight/:flightId/available')
  async findAvailableSeats(
    @Param('flightId') flightId: string,
    @Query() query: SeatQueryDto,
  ) {
    const result = await this.seatService.findAvailableSeats(
      flightId,
      query.seatClass as SeatClass,
      query.page && query.limit
        ? { page: query.page, limit: query.limit }
        : undefined,
    );
    return {
      ...result,
      data: SeatMapper.toResponseDtoList(result.data),
    };
  }

  @Get('flight/:flightId/map')
  async getFlightSeatMap(
    @Param('flightId') flightId: string,
  ): Promise<SeatMapResponseDto> {
    const seatMap = await this.seatService.getFlightSeatMap(flightId);
    return SeatMapper.toSeatMapDto(seatMap);
  }

  @Get('flight/:flightId/statistics')
  async getSeatStatistics(
    @Param('flightId') flightId: string,
  ): Promise<SeatStatisticsResponseDto> {
    const stats = await this.seatService.getSeatStatistics(flightId);
    return SeatMapper.toStatisticsDto(stats);
  }

  @Get('flight/:flightId/seat/:seatNumber')
  async findSeatByNumber(
    @Param('flightId') flightId: string,
    @Param('seatNumber') seatNumber: string,
  ): Promise<SeatResponseDto> {
    const seat = await this.seatService.findSeatByNumber(flightId, seatNumber);
    return SeatMapper.toResponseDto(seat);
  }

  @Get('user/:userId/reserved')
  async findReservedByUser(
    @Param('userId') userId: string,
  ): Promise<SeatResponseDto[]> {
    const seats = await this.seatService.findReservedByUser(userId);
    return SeatMapper.toResponseDtoList(seats);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<SeatResponseDto> {
    const seat = await this.seatService.findById(id);
    return SeatMapper.toResponseDto(seat);
  }

  @Post()
  async create(@Body() createSeatDto: CreateSeatDto): Promise<SeatResponseDto> {
    const seat = await this.seatService.createSeat({
      flightId: createSeatDto.flightId,
      row: createSeatDto.row,
      column: createSeatDto.column,
      seatClass: createSeatDto.seatClass as SeatClass,
      seatType: createSeatDto.seatType as SeatType,
      features: createSeatDto.features as any[],
      basePrice: createSeatDto.basePrice,
    });
    return SeatMapper.toResponseDto(seat);
  }

  @Post('generate')
  async generateSeats(
    @Body() generateSeatsDto: GenerateSeatsDto,
  ): Promise<SeatResponseDto[]> {
    const seats = await this.seatService.generateSeatsForFlight(
      generateSeatsDto.flightId,
      {
        totalRows: generateSeatsDto.totalRows,
        columnsPerRow: generateSeatsDto.columnsPerRow,
        economyRows: generateSeatsDto.economyRows,
        premiumEconomyRows: generateSeatsDto.premiumEconomyRows,
        businessRows: generateSeatsDto.businessRows,
        firstRows: generateSeatsDto.firstRows,
      },
      generateSeatsDto.basePrice,
    );
    return SeatMapper.toResponseDtoList(seats);
  }

  @Put(':id/reserve')
  async reserve(
    @Param('id') id: string,
    @Body() reserveSeatDto: ReserveSeatDto,
  ): Promise<SeatResponseDto> {
    const seat = await this.seatService.reserveSeat(id, reserveSeatDto.userId);
    return SeatMapper.toResponseDto(seat);
  }

  @Put('flight/:flightId/seat/:seatNumber/reserve')
  async reserveByNumber(
    @Param('flightId') flightId: string,
    @Param('seatNumber') seatNumber: string,
    @Body() reserveSeatDto: ReserveSeatDto,
  ): Promise<SeatResponseDto> {
    const seat = await this.seatService.reserveSeatByNumber(
      flightId,
      seatNumber,
      reserveSeatDto.userId,
    );
    return SeatMapper.toResponseDto(seat);
  }

  @Put(':id/occupy')
  async occupy(@Param('id') id: string): Promise<SeatResponseDto> {
    const seat = await this.seatService.occupySeat(id);
    return SeatMapper.toResponseDto(seat);
  }

  @Put(':id/release')
  async release(@Param('id') id: string): Promise<SeatResponseDto> {
    const seat = await this.seatService.releaseSeat(id);
    return SeatMapper.toResponseDto(seat);
  }

  @Put(':id/block')
  async block(@Param('id') id: string): Promise<SeatResponseDto> {
    const seat = await this.seatService.blockSeat(id);
    return SeatMapper.toResponseDto(seat);
  }

  @Put(':id/unblock')
  async unblock(@Param('id') id: string): Promise<SeatResponseDto> {
    const seat = await this.seatService.unblockSeat(id);
    return SeatMapper.toResponseDto(seat);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.seatService.deleteSeat(id);
  }
}
