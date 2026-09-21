export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  fromPrice: number;
  duration: number; // in hours
  image: string;
  createdAt?: string; // ISO timestamp — used to show "NEW" badge within 7 days
}

export interface GalleryItem {
  id: string;
  image: string;
  category: string;
  title: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  validUntil?: string; // Optional date string "YYYY-MM-DD"
  createdAt: string;   // ISO timestamp
}

export interface BookingDetails {
  id: string;           // Unique booking reference e.g. "BK-1720940000000"
  bookedAt: string;     // ISO timestamp of when booking was created
  packageName: string;  // Human-readable package/service chosen by client
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  eventType: string;
  amount: number;
  inspirationImage?: string;
  selectedServices: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    description?: string;
  }>;
  travelCharges: number;
  earlyMorningCharges: number;
  date?: string;
  time?: string;
}

