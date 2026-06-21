import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    venue: z.string().min(3, 'Venue is required'),
    eventDate: z.string().datetime('Invalid date format, use ISO string'),
    totalTickets: z.number().int().positive('Total tickets must be positive'),
  }),
});

export const updateEventSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid event ID'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    venue: z.string().min(3).optional(),
    eventDate: z.string().datetime().optional(),
    totalTickets: z.number().int().positive().optional(),
  }),
});

export const eventIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid event ID'),
  }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>['body'];
export type UpdateEventInput = z.infer<typeof updateEventSchema>['body'];
