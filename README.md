# Museo Web App

Este proyecto es una aplicación web de museo donde los administradores pueden crear artículos y los usuarios pueden ver un catálogo de la información subida. El proyecto está construido con **Next.js**, **Node.js** y **MongoDB**.

## Instalación

### 1. Requisitos previos

Antes de comenzar, asegúrarse de tener **Node.js** instalado en tu máquina. Si no lo tienes, puedes instalarlo desde [aquí](https://nodejs.org/).

### 2. Clonar el repositorio

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### 3. Instalar las dependencias
````bash
npm install
````


### 4. Crear un usuario administrador

#### 4.1 Navega a la carpeta scripts:

`````
cd scripts
`````

#### 4.2 Ejecuta el script para crear el administrador

````node createAdmin.js````

Este script creará un usuario administrador con las credenciales:

Email: admin@example.com

Contraseña: your_secure_password

### 5. Ejecutar la aplicacion
```npm run dev``` 
#### 5.1 Ingresar al sistema
```http://localhost:3000/login```

Si ingresas incorrectamente varias veces, verás el sistema de rate limiting en acción. El rate limiter bloquea el acceso si intentas ingresar mal las credenciales muchas veces en un corto período de tiempo. Tras varios intentos fallidos, deberas esperar 10 segundos antes de volver a intentar. Si intentas ingresar continuamente de forma incorrecta, la cuenta quedará bloqueada temporalmente sin importar si se ingresa las credenciales correctas.
#### 6. Crear y visualizar un articulo
En la pagina de administrador crea un articulo con datos ejemplificados debes tener al menos dos imagenes para tal efecto. Una vez creado el articulo podras verlos en la pagina: 

``` http://localhost:3000/catalogo```

Esto se logra gracias a los metodos http para agregar, eliminar y obtener informacion desde el lado del servidor.

