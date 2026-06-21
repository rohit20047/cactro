import { PrismaClient, Booking, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createBooking = async (
  data: Prisma.BookingUncheckedCreateInput,
  tx?: Prisma.TransactionClient
): Promise<Booking> => {
  const client = tx || prisma;
  return await client.booking.create({ data });
};

export const findBookingsByUser = async (userId: string): Promise<Booking[]> => {
  return await prisma.booking.findMany({
    where: { userId },
    include: { event: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const findBookingsByEvent = async (eventId: string): Promise<Booking[]> => {
  return await prisma.booking.findMany({
    where: { eventId },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
};

// Expose prisma for transactions
export { prisma };
