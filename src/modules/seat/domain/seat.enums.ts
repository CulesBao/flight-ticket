export enum SeatClass {
  ECONOMY = 'economy',
  PREMIUM_ECONOMY = 'premium_economy',
  BUSINESS = 'business',
  FIRST = 'first',
}

export enum SeatType {
  WINDOW = 'window',
  MIDDLE = 'middle',
  AISLE = 'aisle',
}

export enum SeatStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
  BLOCKED = 'blocked', // For maintenance or other reasons
}

export enum SeatFeature {
  EXTRA_LEGROOM = 'extra_legroom',
  POWER_OUTLET = 'power_outlet',
  WIFI = 'wifi',
  MEAL_SERVICE = 'meal_service',
  PRIORITY_BOARDING = 'priority_boarding',
}
