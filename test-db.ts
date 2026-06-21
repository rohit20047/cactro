import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing DB Connection...');
  
  // Create a user
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      password: 'hashed_password_123',
      role: 'CUSTOMER'
    }
  });
  console.log('Successfully inserted user:', user.email);

  // Read the user
  const fetchedUser = await prisma.user.findUnique({
    where: { id: user.id }
  });
  console.log('Successfully fetched user:', fetchedUser?.email);

  // Update the user
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { name: 'Updated Test User' }
  });
  console.log('Successfully updated user:', updatedUser.name);

  // Delete the user
  await prisma.user.delete({
    where: { id: user.id }
  });
  console.log('Successfully deleted user.');
}

main()
  .catch((e) => {
    console.error('DB Test Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
