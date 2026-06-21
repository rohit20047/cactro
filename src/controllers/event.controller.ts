import { Request, Response, NextFunction } from 'express';
import { createEventSchema, updateEventSchema, eventIdParamSchema } from '../validators/event.validator';
import {
  createEventService,
  updateEventService,
  deleteEventService,
  getEventsService,
  getEventByIdService,
  getMyEventsService,
  getEventBookingsService
} from '../services/event.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const createEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = createEventSchema.parse(req);
    const event = await createEventService(validatedData.body, req.user!.userId);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateEventSchema.parse(req);
    const event = await updateEventService(validatedData.params.id, validatedData.body, req.user!.userId);
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = eventIdParamSchema.parse(req);
    const result = await deleteEventService(validatedData.params.id, req.user!.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await getEventsService();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = eventIdParamSchema.parse(req);
    const event = await getEventByIdService(validatedData.params.id);
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const getMyEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const events = await getMyEventsService(req.user!.userId);
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

export const getEventBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = eventIdParamSchema.parse(req);
    const bookings = await getEventBookingsService(validatedData.params.id, req.user!.userId);
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};
