import { FlightStatus, AircraftType } from '../domain/flight.enums';

export class FlightResponseDto {
  id: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  aircraftType: AircraftType;
  basePrice: number;
  currency: string;
  status: FlightStatus;
  duration: number;

  constructor(data: {
    id: string;
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    aircraftType: AircraftType;
    basePrice: number;
    currency: string;
    status: FlightStatus;
    duration: number;
  }) {
    this.id = data.id;
    this.flightNumber = data.flightNumber;
    this.departureAirport = data.departureAirport;
    this.arrivalAirport = data.arrivalAirport;
    this.departureTime = data.departureTime;
    this.arrivalTime = data.arrivalTime;
    this.aircraftType = data.aircraftType;
    this.basePrice = data.basePrice;
    this.currency = data.currency;
    this.status = data.status;
    this.duration = data.duration;
  }
}
