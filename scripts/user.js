// listUsers from our supabase storage
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log('Usuarios:', users);
  } catch (error) {
    console.error('Error listando usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
