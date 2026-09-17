// Firebase configuration and Firestore helper functions
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { BookingDetails } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyAt9RWi2MHTa7tFKmARiDfDI3H85tlhTfY",
  authDomain: "geetha-mua.firebaseapp.com",
  projectId: "geetha-mua",
  storageBucket: "geetha-mua.firebasestorage.app",
  messagingSenderId: "143613113745",
  appId: "1:143613113745:web:bdb2334d556158b0ec9630",
  measurementId: "G-EB2875T78G"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Collection reference
const BOOKINGS_COLLECTION = 'bookings';

// ── Save a new booking to Firestore ─────────────────────────────────────────
export async function saveBookingToFirestore(booking: BookingDetails): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
      ...booking,
      createdAt: Timestamp.now(),
    });
    console.log('Booking saved to Firestore:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving booking to Firestore:', error);
    throw error;
  }
}

// ── Fetch all bookings from Firestore (for Owner Dashboard) ─────────────────
export async function fetchBookingsFromFirestore(): Promise<BookingDetails[]> {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const bookings: BookingDetails[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: data.id || doc.id,
        bookedAt: data.bookedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        packageName: data.packageName || data.eventType || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        email: data.email || '',
        eventType: data.eventType || '',
        amount: data.amount || 0,
        inspirationImage: data.inspirationImage || undefined,
        selectedServices: data.selectedServices || [],
        travelCharges: data.travelCharges || 0,
        earlyMorningCharges: data.earlyMorningCharges || 0,
        date: data.date || '',
        time: data.time || '',
      });
    });

    return bookings;
  } catch (error) {
    console.error('Error fetching bookings from Firestore:', error);
    return [];
  }
}
