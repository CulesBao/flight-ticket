import { Injectable } from '@nestjs/common';
import {
  PassengerEntity,
  PassengerRepository,
  PassengerType,
} from 'src/domain/passengers';

@Injectable()
export class InMemoryPassengerRepository implements PassengerRepository {
  private passengers: PassengerEntity[] = [
    new PassengerEntity(
      'passenger-1',
      'John',
      'Doe',
      'john.doe@example.com',
      '+84123456789',
      new Date('1990-01-01'),
      'P1234567',
      'VN',
      PassengerType.ADULT,
    ),
    new PassengerEntity(
      'passenger-2',
      'Jane',
      'Smith',
      'jane.smith@example.com',
      '+84987654321',
      new Date('2010-05-10'),
      'P7654321',
      'VN',
      PassengerType.CHILD,
    ),
    new PassengerEntity(
      'passenger-3',
      'Baby',
      'Doe',
      'baby.doe@example.com',
      '+84111222333',
      new Date('2023-01-01'),
      'P1112223',
      'VN',
      PassengerType.INFANT,
    ),
  ];

  findById(id: string): PassengerEntity | null {
    return this.passengers.find((p) => p.id === id) || null;
  }

  findAll(): PassengerEntity[] {
    return [...this.passengers];
  }

  save(passenger: PassengerEntity): void {
    const idx = this.passengers.findIndex((p) => p.id === passenger.id);
    if (idx !== -1) {
      this.passengers[idx] = passenger;
    } else {
      this.passengers.push(passenger);
    }
  }

  delete(id: string): void {
    this.passengers = this.passengers.filter((p) => p.id !== id);
  }
}
