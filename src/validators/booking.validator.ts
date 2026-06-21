import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    eventId: z.string().uuid('Invalid event ID'),
    ticketCount: z.number().int().positive('Ticket count must be at least 1'),
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>['body'];
