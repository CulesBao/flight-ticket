import { PlaneEntity } from '../entities/plane.entity';

export interface PlaneRepository {
  findById(id: string): Promise<PlaneEntity | null>;
  findAll(): Promise<PlaneEntity[]>;
  findByAirlineId(airlineId: string): Promise<PlaneEntity[]>;
  create(plane: PlaneEntity): Promise<PlaneEntity>;
  update(plane: PlaneEntity): Promise<PlaneEntity>;
  delete(id: string): Promise<void>;
}
