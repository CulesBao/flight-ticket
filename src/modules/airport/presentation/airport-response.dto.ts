import { ApiProperty } from '@nestjs/swagger';

export class AirportResponseDto {
  @ApiProperty({ example: 'SGN' })
  code: string;

  @ApiProperty({ example: 'Tan Son Nhat International Airport' })
  officialName: string;

  @ApiProperty({ example: 'Tan Son Nhat' })
  commonName: string;

  @ApiProperty({ example: 'Ho Chi Minh City' })
  cityName: string;

  @ApiProperty({ example: 'Vietnam' })
  countryName: string;

  constructor(data: {
    code: string;
    officialName: string;
    commonName: string;
    cityName: string;
    countryName: string;
  }) {
    this.code = data.code;
    this.officialName = data.officialName;
    this.commonName = data.commonName;
    this.cityName = data.cityName;
    this.countryName = data.countryName;
  }
}
