export interface Airline {
  id: string;
  fullName: string;
  shortName: string;
  countryName: string;
  cityName: string;
  commonName: string;
  logoUrl: string;
  establishedYear: number;
  description: string;
}
export class AirlineEntity implements Airline {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly shortName: string,
    public readonly countryName: string,
    public readonly cityName: string,
    public readonly commonName: string,
    public readonly logoUrl: string,
    public readonly establishedYear: number,
    public readonly description: string,
  ) {
    this.validateId(id);
  }

  private validateId(id: string): void {
    if (!id || id.length !== 3) {
      throw new Error('Airline ID must be exactly 3 characters');
    }
  }

  equals(other: AirlineEntity): boolean {
    return this.id === other.id;
  }
}
