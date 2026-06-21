import { PrismaClient, Event, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createEvent = async (data: Prisma.EventUncheckedCreateInput): Promise<Event> => {
  return await prisma.event.create({ data });
};

export const updateEvent = async (id: string, data: Prisma.EventUpdateInput): Promise<Event> => {
  return await prisma.event.update({ where: { id }, data });
};

export const deleteEvent = async (id: string): Promise<Event> => {
  return await prisma.event.delete({ where: { id } });
};

export const findEventById = async (id: string): Promise<Event | null> => {
  return await prisma.event.findUnique({ where: { id } });
};

export const findAllEvents = async (): Promise<Event[]> => {
  return await prisma.event.findMany({
    orderBy: { eventDate: 'asc' },
  });
};

export const findEventsByOrganizer = async (organizerId: string): Promise<Event[]> => {
  return await prisma.event.findMany({
    where: { organizerId },
    orderBy: { createdAt: 'desc' },
  });
};
