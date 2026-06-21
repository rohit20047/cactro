import { Response, NextFunction } from 'express';
import { createBookingSchema } from '../validators/booking.validator';
import { createBookingService, getMyBookingsService } from '../services/booking.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = createBookingSchema.parse(req);
    const booking = await createBookingService(validatedData.body, req.user!.userId);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bookings = await getMyBookingsService(req.user!.userId);
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};
