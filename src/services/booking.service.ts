import { createBooking, findBookingsByUser, prisma } from '../repositories/booking.repository';
import { findEventById, updateEvent } from '../repositories/event.repository';
import { findUserById } from '../repositories/user.repository';
import { CreateBookingInput } from '../validators/booking.validator';
import { sendBookingConfirmationEmail } from '../queues/email.queue';
import { EventError } from './event.service';

export class BookingError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, BookingError.prototype);
  }
}

export const createBookingService = async (data: CreateBookingInput, userId: string) => {
  // Use a transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) {
      throw new BookingError('Event not found', 404);
    }

    if (event.availableTickets < data.ticketCount) {
      throw new BookingError('Not enough available tickets', 400);
    }

    // Deduct available tickets
    await tx.event.update({
      where: { id: event.id },
      data: { availableTickets: event.availableTickets - data.ticketCount },
    });

    // Create booking
    const booking = await createBooking(
      {
        userId,
        eventId: event.id,
        ticketCount: data.ticketCount,
      },
      tx
    );

    return booking;
  });

  // Fetch user to get email for background job
  const user = await findUserById(userId);
  
  if (user) {
    // Trigger Background Task: Booking Confirmation
    await sendBookingConfirmationEmail(user.email, result.id);
  }

  return result;
};

export const getMyBookingsService = async (userId: string) => {
  return await findBookingsByUser(userId);
};
