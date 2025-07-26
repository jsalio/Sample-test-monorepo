# Usar imagen ligera de Bun
FROM oven/bun:slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y bun.lockb del monorepo
COPY package.json bun.lockb* ./

# Copiar paquetes necesarios
# Asegúrate de que las rutas coincidan con tu estructura de monorepo
# Aquí se asume que tienes un monorepo con paquetes en 'packages/api', 'packages/core' y 'packages/db'
# Si tus paquetes están en otro lugar, ajusta las rutas según sea necesario
COPY packages/api ./packages/api
COPY packages/core ./packages/core
COPY packages/db ./packages/db

# Instalar dependencias
RUN bun install

# Establecer variables de entorno por defecto
# Asegúrate de que estas variables coincidan con tu configuración
# Si estás usando otro valor, cámbialo aquí
# Por ejemplo, si tu aplicación usa otro entorno, cambia a:
# ENV NODE_ENV=production
# Aquí se asume que estás en un entorno de desarrollo
# Si estás en producción, cambia a 'production'
ENV NODE_ENV=development
# Establecer puerto por defecto
# Asegúrate de que el puerto coincida con el que usas en tu aplicación
# Si tu aplicación escucha en otro puerto, cámbialo aquí
# Por defecto, la aplicación escucha en el puerto 3001
# Si estás usando otro puerto, cámbialo aquí también
# Por ejemplo, si tu aplicación escucha en el puerto 4000, cambia a:
# ENV PORT=4000
# Aquí se asume que la aplicación escucha en el puerto 3001
ENV PORT=3001
# Establecer clave secreta para JWT
# Asegúrate de que esta clave sea segura y única para tu aplicación
# Si estás usando otro valor, cámbialo aquí
# Por ejemplo, si tu clave secreta es 'mi-clave-secreta' cambia a:
# ENV JWT_SECRET=mi-clave-secreta
ENV JWT_SECRET=my-super-secret-key-1234567890
# Establecer URL del servicio de autenticación
# Asegúrate de que el nombre del servicio de autenticación coincida con el de tu docker-compose
# Si estás usando docker-compose, el nombre del servicio debe ser 'sample-mono-auth'
# Si no, ajusta la URL según tu configuración
# Por ejemplo, si tu servicio de autenticación se llama 'auth', cambia a:
# ENV AUTH_SERVICE_URL=http://auth:3002
# Si estás usando otro puerto, cámbialo aquí también
# Por defecto, el servicio de autenticación escucha en el puerto 3002
# Aquí se asume que el servicio de autenticación se llama 'sample-mono-auth'
ENV AUTH_SERVICE_URL=http://sample-mono-auth:3002
# Establecer URL de RabbitMQ
# Asegúrate de que el nombre del servicio de RabbitMQ coincida con el de tu docker-compose
# Si estás usando docker-compose, el nombre del servicio debe ser 'sample-mono-rabbitmq'
# Si no, ajusta la URL según tu configuración
# Por ejemplo, si RabbitMQ está en el mismo contenedor, podrías usar 'localhost'
# o si está en otro contenedor, usa el nombre del servicio de Docker Compose
# Aquí se asume que el servicio de RabbitMQ se llama 'sample-mono-rabbitmq'
# y está en el mismo docker-compose
# Si estás usando otro nombre, cámbialo aquí
# Por ejemplo, si tu servicio RabbitMQ se llama 'rabbitmq', cambia a:
# ENV RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
# Si estás usando otro puerto, cámbialo aquí también
# Por defecto, RabbitMQ escucha en el puerto 5672
ENV RABBITMQ_URL=amqp://guest:guest@sample-mono-rabbitmq:5672 

# Exponer puerto
EXPOSE 3001

# Comando por defecto: iniciar servidor
CMD ["bun", "run", "packages/api/src/index.ts"]