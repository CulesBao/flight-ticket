export class AirportResponseDto {
  code: string;
  name: string;
  displayName: string;
  city: string;
  country: string;
  constructor(data: {
    code: string;
    officialName: string;
    commonName: string;
    cityName: string;
    countryName: string;
  }) {
    this.code = data.code;
    this.name = data.officialName;
    this.displayName = data.commonName;
    this.city = data.cityName;
    this.country = data.countryName;
  }
}
