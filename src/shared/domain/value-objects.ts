export abstract class ValueObject {
  public equals(vo?: ValueObject): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.constructor.name !== this.constructor.name) {
      return false;
    }

    return JSON.stringify(this) === JSON.stringify(vo);
  }
}

export class Email extends ValueObject {
  private readonly _value: string;

  constructor(value: string) {
    super();
    this._validate(value);
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  private _validate(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }
}

export class Money extends ValueObject {
  constructor(
    public readonly amount: number,
    public readonly currency: string,
  ) {
    super();
    this._validate(amount, currency);
  }

  private _validate(amount: number, currency: string): void {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be a 3-letter code');
    }
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }
}
