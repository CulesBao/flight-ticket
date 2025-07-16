import { Injectable, Inject } from '@nestjs/common';
import { AirportRepository, Airport, AirportNotFoundError } from '../domain';
import { PaginationOptions, PaginatedResult } from '../../../shared/domain';
import { AIRPORT_TOKENS } from './airport.tokens';
import {
  REDIS_TOKENS,
  RedisClusterService,
} from '../../../infrastructure/cache/redis';
import {
  REDLOCK_TOKENS,
  RedlockService,
} from '../../../infrastructure/cache/redlock';

@Injectable()
export class AirportService {
  constructor(
    @Inject(AIRPORT_TOKENS.AIRPORT_REPOSITORY)
    private readonly airportRepository: AirportRepository,
    @Inject(REDIS_TOKENS.REDIS_SERVICE)
    private readonly redisService: RedisClusterService,
    @Inject(REDLOCK_TOKENS.REDLOCK_SERVICE)
    private readonly redlockService: RedlockService,
  ) {}

  async findByCode(code: string): Promise<Airport> {
    const cacheKey = `airport:${code.toUpperCase()}`;
    const lockKey = `lock:airport:${code.toUpperCase()}`;

    // Try to get from cache first
    try {
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        const airportData = JSON.parse(cached) as Airport;
        return Airport.create(
          airportData.code.value,
          airportData.officialName,
          airportData.commonName,
          airportData.cityName,
          airportData.countryName,
        );
      }
    } catch (error) {
      // Log cache error but continue with database lookup
      console.warn('Cache read error:', error);
    }

    // Use distributed lock to prevent cache stampede
    return this.redlockService.using(
      lockKey,
      5000, // 5 seconds lock
      async () => {
        // Double-check cache after acquiring lock
        try {
          const cached = await this.redisService.get(cacheKey);
          if (cached) {
            const airportData = JSON.parse(cached) as Airport;
            return Airport.create(
              airportData.code.value,
              airportData.officialName,
              airportData.commonName,
              airportData.cityName,
              airportData.countryName,
            );
          }
        } catch (error) {
          console.warn('Cache read error:', error);
        }

        // Get from database
        const airport = await this.airportRepository.findByCode(
          code.toUpperCase(),
        );

        if (!airport) {
          throw new AirportNotFoundError(code);
        }

        // Cache the result
        try {
          const cacheData = {
            code: airport.code.value,
            officialName: airport.officialName,
            commonName: airport.commonName,
            cityName: airport.cityName,
            countryName: airport.countryName,
          };
          await this.redisService.set(
            cacheKey,
            JSON.stringify(cacheData),
            3600,
          ); // 1 hour TTL
        } catch (error) {
          console.warn('Cache write error:', error);
        }

        return airport;
      },
    );
  }

  async findAll(
    options?: PaginationOptions,
  ): Promise<PaginatedResult<Airport>> {
    return this.airportRepository.findAll(options);
  }

  async findById(id: string): Promise<Airport> {
    const airport = await this.airportRepository.findById(id);

    if (!airport) {
      throw new AirportNotFoundError(id);
    }

    return airport;
  }

  async save(airport: Airport): Promise<Airport> {
    return this.airportRepository.save(airport);
  }

  async delete(id: string): Promise<void> {
    await this.airportRepository.delete(id);
  }
}
