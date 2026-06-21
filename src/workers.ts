import { Worker } from 'bullmq';
import connection from './queues/redis.connection';

export const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    const { email, bookingId } = job.data;
    console.log(`[Job ID: ${job.id}] Booking confirmation email sent to ${email} for booking ${bookingId}`);
  },
  { connection: connection as any }
);

export const notificationWorker = new Worker(
  'notificationQueue',
  async (job) => {
    const { eventId, customerEmails } = job.data;
    console.log(`[Job ID: ${job.id}] Notification sent to ${customerEmails.length} customers regarding event update (Event ID: ${eventId})`);
  },
  { connection: connection as any }
);

emailWorker.on('failed', (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err);
});

notificationWorker.on('failed', (job, err) => {
  console.error(`Notification job ${job?.id} failed:`, err);
});
