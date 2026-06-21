import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getMyEvents,
  getEventBookings
} from '../controllers/event.controller';

const router = Router();

// Customer APIs (Browsing events requires authentication for consistency, or it could be public)
// Assuming public for browsing, but Customer for booking
router.get('/', getAllEvents);
router.get('/my-events', authenticate, authorize(['ORGANIZER']), getMyEvents);
router.get('/:id', getEventById);
router.get('/:id/bookings', authenticate, authorize(['ORGANIZER']), getEventBookings);

// Organizer APIs
router.post('/', authenticate, authorize(['ORGANIZER']), createEvent);
router.put('/:id', authenticate, authorize(['ORGANIZER']), updateEvent);
router.delete('/:id', authenticate, authorize(['ORGANIZER']), deleteEvent);

export default router;
