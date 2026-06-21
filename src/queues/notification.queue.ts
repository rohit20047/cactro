import { Queue } from 'bullmq';
import connection from './redis.connection';

export const notificationQueue = new Queue('notificationQueue', { connection });

export const sendEventUpdateNotification = async (eventId: string, customerEmails: string[]) => {
  await notificationQueue.add('eventUpdateNotification', { eventId, customerEmails });
};
