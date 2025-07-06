export enum PassengerType {
  ADULT = 'ADULT',
  CHILD = 'CHILD',
  INFANT = 'INFANT',
}

export interface Passenger {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly dateOfBirth: Date;
  readonly passportNumber: string;
  readonly nationality: string;
  readonly type: PassengerType;
}

export class PassengerEntity implements Passenger {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly dateOfBirth: Date,
    public readonly passportNumber: string,
    public readonly nationality: string,
    public readonly type: PassengerType,
  ) {
    this.validateEmail(email);
    this.validatePhoneNumber(phoneNumber);
    this.validatePassportNumber(passportNumber);
    this.validateAge();
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  private validatePhoneNumber(phoneNumber: string): void {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }
  }

  private validatePassportNumber(passportNumber: string): void {
    if (!passportNumber || passportNumber.length < 6) {
      throw new Error('Passport number must be at least 6 characters');
    }
  }

  private validateAge(): void {
    const age = this.getAge();

    switch (this.type) {
      case PassengerType.ADULT:
        if (age < 18) {
          throw new Error('Adult passenger must be 18 or older');
        }
        break;
      case PassengerType.CHILD:
        if (age < 2 || age >= 18) {
          throw new Error('Child passenger must be between 2 and 17 years old');
        }
        break;
      case PassengerType.INFANT:
        if (age >= 2) {
          throw new Error('Infant passenger must be under 2 years old');
        }
        break;
    }
  }

  getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
