import { BaseEntity } from '../../../shared/domain';
import { AirportCode } from './airport-code.vo';

export class Airport extends BaseEntity {
  constructor(
    id: string,
    private readonly _code: AirportCode,
    private readonly _officialName: string,
    private readonly _commonName: string,
    private readonly _cityName: string,
    private readonly _countryName: string,
  ) {
    super(id);
    this._validate();
  }

  get code(): AirportCode {
    return this._code;
  }

  get officialName(): string {
    return this._officialName;
  }

  get commonName(): string {
    return this._commonName;
  }

  get cityName(): string {
    return this._cityName;
  }

  get countryName(): string {
    return this._countryName;
  }

  private _validate(): void {
    if (!this._officialName || this._officialName.trim().length === 0) {
      throw new Error('Official name is required');
    }
    if (!this._commonName || this._commonName.trim().length === 0) {
      throw new Error('Common name is required');
    }
    if (!this._cityName || this._cityName.trim().length === 0) {
      throw new Error('City name is required');
    }
    if (!this._countryName || this._countryName.trim().length === 0) {
      throw new Error('Country name is required');
    }
  }

  static create(
    code: string,
    officialName: string,
    commonName: string,
    cityName: string,
    countryName: string,
  ): Airport {
    const airportCode = new AirportCode(code);
    return new Airport(
      airportCode.value, // Use code as ID for airports
      airportCode,
      officialName,
      commonName,
      cityName,
      countryName,
    );
  }
}
