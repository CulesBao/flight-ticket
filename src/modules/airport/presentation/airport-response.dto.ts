import { ApiProperty } from '@nestjs/swagger';

export class AirportResponseDto {
  @ApiProperty({ example: 'SGN', description: 'Airport code' })
  code: string;

  @ApiProperty({
    example: 'Tan Son Nhat International Airport',
    description: 'Airport name',
  })
  name: string;

  @ApiProperty({ example: 'Tan Son Nhat', description: 'Airport display name' })
  displayName: string;

  @ApiProperty({ example: 'Ho Chi Minh City', description: 'City name' })
  city: string;

  @ApiProperty({ example: 'Vietnam', description: 'Country name' })
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
