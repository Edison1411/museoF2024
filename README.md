# Museo Web App

Este proyecto es una aplicación web de museo donde los administradores pueden crear artículos y los usuarios pueden ver un catálogo de la información subida. El proyecto está construido con **Next.js**, **Node.js**, **PostgreSQL**, y **Prisma**.

## Instalación

### 1. Requisitos previos

Antes de comenzar, asegúrate de tener **Node.js** instalado en tu máquina. Si no lo tienes, puedes instalarlo desde [aquí](https://nodejs.org/).

### 2. Clonar el repositorio

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/Edison1411/museeF2024.git
cd museeF2024
```

### 3. Configurar la base de datos

#### 3.1 Crear una base de datos en Supabase

- Regístrate o inicia sesión en [Supabase](https://supabase.com/).
- Crea un nuevo proyecto y toma nota de la URL de la base de datos y la clave API.

#### 3.2 Configurar Prisma

- Asegúrate de tener Prisma instalado globalmente:

  ```bash
  npm install -g prisma
  ```

- Configura tu archivo `.env` con la URL de la base de datos de Supabase:

  ```plaintext
  DATABASE_URL=postgresql://usuario:contraseña@host:puerto/base_de_datos
  JWT_SECRET=tu_secreto_jwt
  ```

- Ejecuta las migraciones de Prisma para configurar la base de datos:

  ```bash
  npx prisma migrate dev --name init
  ```

### 4. Instalar las dependencias

```bash
npm install
```

### 5. Crear los usuarios con los diferentes roles

#### 5.1 Navega a la carpeta scripts:

```bash
cd scripts
```

#### 5.2 Ejecuta el script para crear los usuarios

```bash
node createUser.js
```

Este script creará los usuarios en nuestra base de datos usando bcrypt

#### 5.3 Crear y visualizar un artículo 

En la página de administrador, puedes crear un artículo con tus propios datos o, si lo prefieres, puedes usar datos de ejemplo (opcional). 
Para hacerlo manualmente, agrega al menos dos imágenes y el contenido de tu elección. Una vez creado el artículo, podrás visualizarlo en la página del catálogo en:

[http://localhost:3000/catalogo](http://localhost:3000/catalogo)

Si prefieres usar un ejemplo automatizado para la creación de artículos, puedes ejecutar el siguiente script. Sin embargo no es necesario pues esto se puede hacer directamente desde el dashboard de administracion:

```bash
node addCatalogue.js
```

### 6. Ejecutar la aplicación

```bash
npm run dev
```

#### 6.1 Ingresar al sistema

Visita [http://localhost:3000/login](http://localhost:3000/login) para iniciar sesión.

Si ingresas incorrectamente varias veces, verás el sistema de rate limiting en acción. El rate limiter bloquea el acceso si intentas ingresar mal las credenciales muchas veces en un corto período de tiempo. Tras varios intentos fallidos, deberás esperar 10 segundos antes de volver a intentar. Si intentas ingresar continuamente de forma incorrecta, la cuenta quedará bloqueada temporalmente sin importar si se ingresan las credenciales correctas.

### 7. Crear y visualizar un artículo

En la página de administrador, crea un artículo con datos ejemplificados. Debes tener al menos dos imágenes para tal efecto. Una vez creado el artículo, podrás verlo en la página:

[http://localhost:3000/catalogo](http://localhost:3000/catalogo)

Esto se logra gracias a los métodos HTTP para agregar, eliminar y obtener información desde el lado del servidor.

## Autenticación y Seguridad

- **Autenticación**: Utilizamos JWT para autenticar a los usuarios. Asegúrate de configurar `JWT_SECRET` en tu archivo `.env`.
- **Rate Limiting**: Limitamos los intentos de inicio de sesión para proteger contra ataques de fuerza bruta.

## Contribuciones

Si deseas contribuir a este proyecto, por favor abre un issue o envía un pull request.
