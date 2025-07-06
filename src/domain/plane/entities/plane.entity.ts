export interface Plane {
  id: string;
  model: string;
  manufacturer: string;
  capacity: number;
  airlineId: string;
  description: string;
}

export class PlaneEntity implements Plane {
  constructor(
    public readonly id: string,
    public readonly model: string,
    public readonly manufacturer: string,
    public readonly capacity: number,
    public readonly airlineId: string,
    public readonly description: string,
  ) {}
  equals(other: PlaneEntity): boolean {
    return this.id === other.id;
  }
}
