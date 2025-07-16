export class UserEmail {
  constructor(private readonly value: string) {
    this.validate();
  }

  private validate(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      throw new Error('Invalid email format');
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: UserEmail): boolean {
    return this.value === other.value;
  }
}

export class PhoneNumber {
  constructor(private readonly value: string) {
    this.validate();
  }

  private validate(): void {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(this.value)) {
      throw new Error('Invalid phone number format');
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}
