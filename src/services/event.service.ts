import { 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  findEventById, 
  findAllEvents, 
  findEventsByOrganizer 
} from '../repositories/event.repository';
import { findBookingsByEvent } from '../repositories/booking.repository';
import { CreateEventInput, UpdateEventInput } from '../validators/event.validator';
import { sendEventUpdateNotification } from '../queues/notification.queue';

export class EventError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, EventError.prototype);
  }
}

export const createEventService = async (data: CreateEventInput, organizerId: string) => {
  return await createEvent({
    ...data,
    availableTickets: data.totalTickets,
    organizerId,
    eventDate: new Date(data.eventDate),
  });
};

export const updateEventService = async (eventId: string, data: UpdateEventInput, organizerId: string) => {
  const event = await findEventById(eventId);
  
  if (!event) {
    throw new EventError('Event not found', 404);
  }
  
  if (event.organizerId !== organizerId) {
    throw new EventError('Forbidden - You are not the organizer of this event', 403);
  }

  let newAvailableTickets = event.availableTickets;

  if (data.totalTickets !== undefined) {
    const ticketDifference = data.totalTickets - event.totalTickets;
    newAvailableTickets = event.availableTickets + ticketDifference;
    
    if (newAvailableTickets < 0) {
      throw new EventError('Cannot reduce total tickets below already booked tickets', 400);
    }
  }

  const updatedEvent = await updateEvent(eventId, {
    ...data,
    eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
    availableTickets: newAvailableTickets,
  });

  // Trigger Background Task: Event Update Notification
  // Fetch all users who booked this event
  const bookings = await findBookingsByEvent(eventId);
  const customerEmails = [...new Set(bookings.map(b => (b as any).user.email))];

  if (customerEmails.length > 0) {
    await sendEventUpdateNotification(eventId, customerEmails);
  }

  return updatedEvent;
};

export const deleteEventService = async (eventId: string, organizerId: string) => {
  const event = await findEventById(eventId);
  
  if (!event) {
    throw new EventError('Event not found', 404);
  }

  if (event.organizerId !== organizerId) {
    throw new EventError('Forbidden - You are not the organizer of this event', 403);
  }

  await deleteEvent(eventId);
  return { message: 'Event deleted successfully' };
};

export const getEventsService = async () => {
  return await findAllEvents();
};

export const getEventByIdService = async (eventId: string) => {
  const event = await findEventById(eventId);
  if (!event) {
    throw new EventError('Event not found', 404);
  }
  return event;
};

export const getMyEventsService = async (organizerId: string) => {
  return await findEventsByOrganizer(organizerId);
};

export const getEventBookingsService = async (eventId: string, organizerId: string) => {
  const event = await findEventById(eventId);
  
  if (!event) {
    throw new EventError('Event not found', 404);
  }

  if (event.organizerId !== organizerId) {
    throw new EventError('Forbidden - You are not the organizer of this event', 403);
  }

  return await findBookingsByEvent(eventId);
};
