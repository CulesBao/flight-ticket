import { Flight } from '../domain/flight.entity';
import { FlightResponseDto } from './flight-response.dto';

export class FlightMapper {
  static toResponseDto(flight: Flight): FlightResponseDto {
    return new FlightResponseDto({
      id: flight.id,
      flightNumber: flight.flightNumber.value,
      departureAirport: flight.departureAirport,
      arrivalAirport: flight.arrivalAirport,
      departureTime: flight.departureTime.toISOString(),
      arrivalTime: flight.arrivalTime.toISOString(),
      aircraftType: flight.aircraftType,
      basePrice: flight.basePrice.amount,
      currency: flight.basePrice.currency,
      status: flight.status,
      duration: flight.duration,
    });
  }

  static toResponseDtoList(flights: Flight[]): FlightResponseDto[] {
    return flights.map((flight) => this.toResponseDto(flight));
  }
}
