import { PrismaClient, User, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
  return await prisma.user.create({
    data,
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
};
