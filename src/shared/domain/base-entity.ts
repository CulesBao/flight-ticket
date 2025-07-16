export abstract class BaseEntity {
  constructor(public readonly id: string) {}

  equals(entity: BaseEntity): boolean {
    if (!(entity instanceof BaseEntity)) {
      return false;
    }
    return this.id === entity.id;
  }
}
