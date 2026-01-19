export interface FlightSegment {
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
}

export interface Flight {
  id: string;
  airline: {
    code: string;
    name: string;
  };
  price: number;
  stops: number;
  durationMinutes: number;
  segments: FlightSegment[];
}

export interface FlightSearchResult {
  meta: {
    currency: string;
    searchId: string;
    cached: boolean;
    expiresAt: string;
  };
  flights: Flight[];
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  travelClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
}

export interface PriceTrendPoint {
  date: string;
  price: number;
}
