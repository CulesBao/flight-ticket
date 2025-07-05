import { AirportEntity } from '../../../domain/airports/entities/airport.entity';
import { AirportResponseDto } from '../dtos/airport-response.dto';

export class AirportMapper {
  static toResponseDto(entity: AirportEntity): AirportResponseDto {
    return new AirportResponseDto(
      entity.airportCode,
      entity.airportOfficialName,
      entity.commonName,
      entity.cityName,
      entity.countryName,
    );
  }

  static toResponseDtoList(entities: AirportEntity[]): AirportResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
