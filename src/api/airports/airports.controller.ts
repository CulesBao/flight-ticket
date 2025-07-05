import {
  Controller,
  Get,
  Param,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  GetAirportByCodeUseCase,
  GetAllAirportsUseCase,
  AirportResponseDto,
  AirportMapper,
} from 'src/app/airports';

@Controller('airports')
export class AirportsController {
  constructor(
    private readonly getAirportByCodeUseCase: GetAirportByCodeUseCase,
    private readonly getAllAirportsUseCase: GetAllAirportsUseCase,
  ) {}

  @Get()
  async findAll(): Promise<AirportResponseDto[]> {
    try {
      const airports = await this.getAllAirportsUseCase.execute();

      return AirportMapper.toResponseDtoList(airports);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @Get(':airportCode')
  async findByCode(
    @Param('airportCode') airportCode: string,
  ): Promise<AirportResponseDto> {
    try {
      const airport = await this.getAirportByCodeUseCase.execute(airportCode);
      return AirportMapper.toResponseDto(airport);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
