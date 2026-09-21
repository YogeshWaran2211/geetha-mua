// Firebase configuration and Firestore + Storage helper functions
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
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
export const db  = getFirestore(app);
export const storage = getStorage(app);

const BOOKINGS_COL = 'bookings';
const SERVICES_COL = 'services';
const OFFERS_COL   = 'offers';

// ════════════════════════════════════════════════════════════════════════════
// IMAGE UPLOAD — Firebase Storage
// Owner uploads local jpg/jpeg/png → stored in cloud → URL returned
// ════════════════════════════════════════════════════════════════════════════
export async function uploadImageToStorage(
  file: File,
  folder: 'services' | 'gallery' = 'services'
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const storageRef = ref(storage, filename);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}

// ════════════════════════════════════════════════════════════════════════════
// BOOKINGS
// ════════════════════════════════════════════════════════════════════════════
export async function saveBookingToFirestore(booking: BookingDetails): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, BOOKINGS_COL), {
      ...booking,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving booking:', error);
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
        packageName: data.packageName || '',
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
    console.error('Error fetching bookings:', error);
    return [];
  }
}

// ════════════════════════════════════════════════════════════════════════════
// SERVICES — Owner edits sync to Firestore so ALL clients see instantly
// ════════════════════════════════════════════════════════════════════════════
export async function saveServiceToFirestore(service: Service): Promise<void> {
  try {
    await setDoc(doc(db, SERVICES_COL, service.id), {
      ...service,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error saving service:', error);
    throw error;
  }
}

export async function deleteServiceFromFirestore(serviceId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SERVICES_COL, serviceId));
  } catch (error) {
    console.error('Error deleting service:', error);
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
    console.error('Error fetching services:', error);
    return [];
  }
}

// Seed initial services to Firestore (called once when owner first sets up)
export async function seedServicesToFirestore(services: Service[]): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, SERVICES_COL));
    if (!snapshot.empty) return; // already seeded
    for (const service of services) {
      await setDoc(doc(db, SERVICES_COL, service.id), {
        ...service,
        createdAt: service.createdAt || new Date().toISOString(),
        updatedAt: Timestamp.now(),
      });
    }
    console.log('Initial services seeded to Firestore');
  } catch (error) {
    console.error('Error seeding services:', error);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// OFFERS — Owner creates → Firestore → clients see via bell icon
// ════════════════════════════════════════════════════════════════════════════
export async function saveOfferToFirestore(offer: Offer): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, OFFERS_COL), {
      ...offer,
      savedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving offer:', error);
    throw error;
  }
}

export async function fetchOffersFromFirestore(): Promise<Offer[]> {
  try {
    // No orderBy — avoids index requirement
    const snapshot = await getDocs(collection(db, OFFERS_COL));
    const offers: Offer[] = snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title || '',
        description: data.description || '',
        validUntil: data.validUntil || undefined,
        createdAt: data.createdAt || data.savedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Offer;
    });
    // Sort in JS instead of Firestore orderBy
    return offers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
}

export async function deleteOfferFromFirestore(offerId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, OFFERS_COL, offerId));
  } catch (error) {
    console.error('Error deleting offer:', error);
  }
}
