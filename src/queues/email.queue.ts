import { Queue } from 'bullmq';
import connection from './redis.connection';

export const emailQueue = new Queue('emailQueue', { connection });

export const sendBookingConfirmationEmail = async (email: string, bookingId: string) => {
  await emailQueue.add('bookingConfirmation', { email, bookingId });
};
