# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Construye la aplicación Next.js
RUN npm run build

# Cambia al modo standalone
WORKDIR /app/.next/standalone

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
