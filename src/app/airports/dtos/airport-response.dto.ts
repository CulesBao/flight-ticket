export class AirportResponseDto {
  airportCode: string;
  airportOfficialName: string;
  commonName: string;
  cityName: string;
  countryName: string;

  constructor(
    airportCode: string,
    airportOfficialName: string,
    commonName: string,
    cityName: string,
    countryName: string,
  ) {
    this.airportCode = airportCode;
    this.airportOfficialName = airportOfficialName;
    this.commonName = commonName;
    this.cityName = cityName;
    this.countryName = countryName;
  }
}
