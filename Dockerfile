# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package.json package-lock.json ./

# Instala dependencias
RUN npm install --production

# Copia todo el proyecto (incluida la carpeta .next generada)
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", ".next/standalone/server.js"]
