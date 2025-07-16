import { Airport } from '../domain/airport.entity';
import { AirportResponseDto } from './airport-response.dto';

export class AirportMapper {
  static toResponseDto(airport: Airport): AirportResponseDto {
    return new AirportResponseDto({
      code: airport.code.value,
      officialName: airport.officialName,
      commonName: airport.commonName,
      cityName: airport.cityName,
      countryName: airport.countryName,
    });
  }

  static toResponseDtoList(airports: Airport[]): AirportResponseDto[] {
    return airports.map((airport) => this.toResponseDto(airport));
  }
}
