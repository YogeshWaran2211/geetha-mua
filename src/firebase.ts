// Firebase configuration and Firestore helper functions
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { BookingDetails, Service, Offer } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyAt9RWi2MHTa7tFKmARiDfDI3H85tlhTfY",
  authDomain: "geetha-mua.firebaseapp.com",
  projectId: "geetha-mua",
  storageBucket: "geetha-mua.firebasestorage.app",
  messagingSenderId: "143613113745",
  appId: "1:143613113745:web:bdb2334d556158b0ec9630",
  measurementId: "G-EB2875T78G"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ─── Collection names ────────────────────────────────────────────────────────
const BOOKINGS_COL = 'bookings';
const SERVICES_COL = 'services';
const OFFERS_COL   = 'offers';

// ════════════════════════════════════════════════════════════════════════════
// BOOKINGS
// ════════════════════════════════════════════════════════════════════════════

export async function saveBookingToFirestore(booking: BookingDetails): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, BOOKINGS_COL), {
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

export async function fetchBookingsFromFirestore(): Promise<BookingDetails[]> {
  try {
    const q = query(collection(db, BOOKINGS_COL), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: data.id || d.id,
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
      } as BookingDetails;
    });
  } catch (error) {
    console.error('Error fetching bookings from Firestore:', error);
    return [];
  }
}

// ════════════════════════════════════════════════════════════════════════════
// SERVICES  (owner edits → stored in Firestore → all clients see instantly)
// ════════════════════════════════════════════════════════════════════════════

export async function saveServiceToFirestore(service: Service): Promise<void> {
  try {
    // Use service.id as Firestore document ID for easy upsert
    await setDoc(doc(db, SERVICES_COL, service.id), {
      ...service,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error saving service to Firestore:', error);
    throw error;
  }
}

export async function deleteServiceFromFirestore(serviceId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SERVICES_COL, serviceId));
  } catch (error) {
    console.error('Error deleting service from Firestore:', error);
  }
}

export async function fetchServicesFromFirestore(): Promise<Service[]> {
  try {
    const snapshot = await getDocs(collection(db, SERVICES_COL));
    if (snapshot.empty) return [];
    return snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name || '',
        category: data.category || '',
        description: data.description || '',
        fromPrice: data.fromPrice || 0,
        duration: data.duration || 1,
        image: data.image || '',
        createdAt: data.createdAt || undefined,
      } as Service;
    });
  } catch (error) {
    console.error('Error fetching services from Firestore:', error);
    return [];
  }
}

// ════════════════════════════════════════════════════════════════════════════
// OFFERS  (owner creates → stored in Firestore → clients see via bell icon)
// ════════════════════════════════════════════════════════════════════════════

export async function saveOfferToFirestore(offer: Offer): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, OFFERS_COL), {
      ...offer,
      savedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving offer to Firestore:', error);
    throw error;
  }
}

export async function fetchOffersFromFirestore(): Promise<Offer[]> {
  try {
    const q = query(collection(db, OFFERS_COL), orderBy('savedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title || '',
        description: data.description || '',
        validUntil: data.validUntil || undefined,
        createdAt: data.createdAt || data.savedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Offer;
    });
  } catch (error) {
    console.error('Error fetching offers from Firestore:', error);
    return [];
  }
}

export async function deleteOfferFromFirestore(offerId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, OFFERS_COL, offerId));
  } catch (error) {
    console.error('Error deleting offer from Firestore:', error);
  }
}
