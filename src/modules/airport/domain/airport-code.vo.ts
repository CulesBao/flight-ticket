export class AirportCode {
  private readonly _value: string;

  constructor(value: string) {
    this._validate(value);
    this._value = value.toUpperCase();
  }

  get value(): string {
    return this._value;
  }

  private _validate(code: string): void {
    if (!code || code.length !== 3) {
      throw new Error('Airport code must be exactly 3 characters');
    }
    if (!/^[A-Z]{3}$/i.test(code)) {
      throw new Error('Airport code must contain only uppercase letters');
    }
  }

  equals(other: AirportCode): boolean {
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}
