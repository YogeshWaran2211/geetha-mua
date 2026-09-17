// EmailJS integration for booking notification emails
import emailjs from '@emailjs/browser';
import { BookingDetails } from './types';

// ── EmailJS Configuration ────────────────────────────────────────────────────
// Fill these in after setting up at emailjs.com
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';    // e.g. service_xxxxxxx
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';   // e.g. template_xxxxxxx
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';     // from Account → API Keys

const OWNER_EMAIL = 'geethasarvan411@gmail.com';

// ── Send booking notification email to owner ─────────────────────────────────
export async function sendBookingEmail(booking: BookingDetails): Promise<void> {
  // Skip if EmailJS is not configured yet
  if (
    EMAILJS_SERVICE_ID  === 'YOUR_SERVICE_ID' ||
    EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
    EMAILJS_PUBLIC_KEY  === 'YOUR_PUBLIC_KEY'
  ) {
    console.warn('EmailJS not configured yet — skipping email notification.');
    return;
  }

  const makeupSvc  = booking.selectedServices.find(s => s.id === 'item-mu');
  const stylingSvc = booking.selectedServices.find(s => s.id === 'item-st');

  const templateParams = {
    to_email:       OWNER_EMAIL,
    client_name:    `${booking.firstName} ${booking.lastName}`,
    client_phone:   booking.phone,
    client_email:   booking.email,
    package_name:   booking.packageName || booking.eventType,
    event_date:     booking.date || 'Not specified',
    event_time:     booking.time || 'Not specified',
    total_amount:   booking.amount.toLocaleString('en-IN'),
    booking_id:     booking.id,
    booked_at:      new Date(booking.bookedAt).toLocaleString('en-IN'),
    makeup_price:   makeupSvc?.price?.toLocaleString('en-IN') || '0',
    styling_price:  stylingSvc?.price?.toLocaleString('en-IN') || '0',
    travel_charges: booking.travelCharges.toLocaleString('en-IN'),
    early_charges:  booking.earlyMorningCharges.toLocaleString('en-IN'),
    inspiration_url: booking.inspirationImage || 'None',
  };

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    console.log('Booking notification email sent to', OWNER_EMAIL);
  } catch (error) {
    console.error('Failed to send booking email:', error);
    // Don't throw — email failure shouldn't block the booking
  }
}
