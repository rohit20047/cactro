import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { createBooking, getMyBookings } from '../controllers/booking.controller';

const router = Router();

router.use(authenticate);

// Customer APIs
router.post('/', authorize(['CUSTOMER']), createBooking);

// General APIs (Prompt specified GET /bookings/my-bookings, which makes sense for Customers, or both)
router.get('/my-bookings', authorize(['CUSTOMER', 'ORGANIZER']), getMyBookings);

export default router;
