export interface Airport {
  readonly airportCode: string;
  readonly airportOfficialName: string;
  readonly commonName: string;
  readonly cityName: string;
  readonly countryName: string;
}

export class AirportEntity implements Airport {
  constructor(
    public readonly airportCode: string,
    public readonly airportOfficialName: string,
    public readonly commonName: string,
    public readonly cityName: string,
    public readonly countryName: string,
  ) {
    this.validateAirportCode(airportCode);
  }

  private validateAirportCode(code: string): void {
    if (!code || code.length !== 3) {
      throw new Error('Airport code must be exactly 3 characters');
    }
    if (!/^[A-Z]{3}$/.test(code)) {
      throw new Error('Airport code must contain only uppercase letters');
    }
  }

  equals(other: AirportEntity): boolean {
    return this.airportCode === other.airportCode;
  }
}
