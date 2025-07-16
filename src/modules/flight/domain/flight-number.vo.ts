import { ValueObject } from '../../../shared/domain';

export class FlightNumber extends ValueObject {
  private readonly _value: string;

  constructor(value: string) {
    super();
    this._validate(value);
    this._value = value.toUpperCase();
  }

  get value(): string {
    return this._value;
  }

  private _validate(flightNumber: string): void {
    if (!flightNumber || flightNumber.trim().length === 0) {
      throw new Error('Flight number is required');
    }

    // Format: 2-3 letter airline code + 1-4 digit flight number (e.g., VN123, QR1234)
    const flightNumberRegex = /^[A-Z]{2,3}\d{1,4}$/i;
    if (!flightNumberRegex.test(flightNumber)) {
      throw new Error(
        'Invalid flight number format. Expected format: VN123, QR1234',
      );
    }
  }

  toString(): string {
    return this._value;
  }
}
