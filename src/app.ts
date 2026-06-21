import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import bookingRoutes from './routes/booking.routes';
// Removed BullMQ workers initialization to use in-memory queue instead

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/bookings', bookingRoutes);

// Error Handling
app.use(errorHandler);

export default app;
