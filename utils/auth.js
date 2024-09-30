import jwt from 'jsonwebtoken';

// Función para verificar el token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
