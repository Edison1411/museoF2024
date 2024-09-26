// scripts/createAdmins.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmins() {
  const saltRounds = 10;

  try {
    // Crear Admin 1
    const admin1 = await prisma.user.create({
      data: {
        username: 'admin',
        password: await bcrypt.hash('password123', saltRounds), // Asegúrate de cambiar la contraseña
        role: 'ADMIN',
      },
    });

    // Crear Admin 2 con permisos restringidos
    const admin2 = await prisma.user.create({
      data: {
        username: 'admin2',
        password: await bcrypt.hash('password456', saltRounds), // Asegúrate de cambiar la contraseña
        role: 'ADMIN_READ',
      },
    });

    console.log('Usuarios creados:', { admin1, admin2 });
  } catch (error) {
    console.error('Error creando usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmins();
