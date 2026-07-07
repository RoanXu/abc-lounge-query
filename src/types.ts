export interface LoungeRecord {
  id: string;
  region: string;
  country: string;
  city: string;
  airportName: string;
  airportCode: string;
  terminal: string;
  loungeName: string;
  departureType: string;
  securityType: string;
  locationGuide: string;
  type: "domestic" | "overseas";
  needsBooking?: string;
  advanceBooking?: string;
  guestPolicy?: string;
}

export interface FilterState {
  region: string;
  country: string;
  city: string;
  citySearch: string;
  airportCode: string;
  departureType: string;
  securityType: string;
}
