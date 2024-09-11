const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('adminPass123', 10);
  await prisma.user.create({
    data: { username: 'admin', passwordHash: adminPassword, role: 'ADMIN' },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());