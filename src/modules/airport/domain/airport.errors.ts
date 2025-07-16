import { DomainError } from '../../../shared/domain';

export class AirportNotFoundError extends DomainError {
  constructor(code: string) {
    super(`Airport with code ${code} not found`);
  }
}
