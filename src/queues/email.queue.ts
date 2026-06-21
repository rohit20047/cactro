// Simulated in-memory async processing mechanism

export const sendBookingConfirmationEmail = async (email: string, bookingId: string) => {
  // Simulate background processing delay
  setTimeout(() => {
    console.log(`[Email Worker] Booking confirmation email sent to ${email} for booking ${bookingId}`);
  }, 1000);
};
