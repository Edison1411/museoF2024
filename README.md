# Museo Web App

Este proyecto es una aplicación web de museo donde los administradores pueden crear artículos y los usuarios pueden ver un catálogo de la información subida. El proyecto está construido con **Next.js**, **Node.js**, **PostgreSQL**, y **Prisma**.

## Instalación

### 1. Requisitos previos

Antes de comenzar, asegúrate de tener **Node.js** instalado en tu máquina. Si no lo tienes, puedes instalarlo desde [aquí](https://nodejs.org/).

### 2. Clonar el repositorio

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/Edison1411/museeF.git
cd museeF
```

### 3. Configurar la base de datos

#### 3.1 Crear una base de datos en Supabase

- Regístrate o inicia sesión en [Supabase](https://supabase.io/).
- Crea un nuevo proyecto y toma nota de la URL de la base de datos y la clave API.

#### 3.2 Configurar Prisma

- Asegúrate de tener Prisma instalado globalmente:

  ```bash
  npm install -g prisma
  ```

- Configura tu archivo `.env` con la URL de la base de datos de Supabase:

  ```bash
DATABASE_URL=""
JWT_SECRET=""
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
NEXT_PUBLIC_API_URL=
  ```

- Ejecuta las migraciones de Prisma para configurar la base de datos:

```bash
npx prisma migrate dev --name init
```

### 4. Instalar las dependencias

```bash
npm install
```

### 5. Crear un usuario administrador

#### 5.1 Navega a la carpeta scripts:

```bash
cd scripts
```

#### 5.2 Ejecuta el script para crear el administrador

```bash
node createAdmin.js
```

Este script creará un usuario administrador con las credenciales:

- Email: admin@example.com
- Contraseña: your_secure_password

### 6. Ejecutar la aplicación

```bash
npm run dev
```

#### 6.1 Ingresar al sistema

Visita [http://localhost:3000/login](http://localhost:3000/login) para iniciar sesión.

Si ingresas incorrectamente varias veces, verás el sistema de rate limiting en acción. El rate limiter bloquea el acceso si intentas ingresar mal las credenciales muchas veces en un corto período de tiempo. Tras varios intentos fallidos, deberás esperar 10 segundos antes de volver a intentar. Si intentas ingresar continuamente de forma incorrecta, la cuenta quedará bloqueada temporalmente sin importar si se ingresan las credenciales correctas. Tambien se integro el acceso el acceso por roles (rbac) junto con restricciones por acceso (abac). Para configuarar esto se puede hacer directamente en el `admin.js`

### 7. Crear y visualizar un artículo

En la página de administrador, crea un artículo con datos ejemplificados. Debes tener al menos dos imágenes para tal efecto. Una vez creado el artículo, podrás verlo en la página:

[http://localhost:3000/catalogo](http://localhost:3000/catalogo)

Esto se logra gracias a los métodos HTTP para agregar, eliminar y obtener información desde el lado del servidor.

## Autenticación y Seguridad

- **Autenticación**: Utilizamos JWT para autenticar a los usuarios. Asegúrate de configurar `JWT_SECRET` en tu archivo `.env`.
- **Protección CSRF**: Implementamos medidas de protección CSRF para asegurar que las solicitudes sean legítimas. Asegúrate de revisar la configuración de seguridad en tu aplicación.
- **Rate Limiting**: Limitamos los intentos de inicio de sesión para proteger contra ataques de fuerza bruta.

## Contribuciones

Si deseas contribuir a este proyecto, por favor abre un issue o envía un pull request.
