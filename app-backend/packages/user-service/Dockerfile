# Usar imagen ligera de Bun
FROM oven/bun:slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y bun.lockb del monorepo
COPY package.json bun.lockb* ./

# Copiar paquetes necesarios
COPY packages/user-service ./packages/user-service
COPY packages/core ./packages/core
COPY packages/db ./packages/db
COPY packages/api ./packages/api

# Instalar dependencias
RUN bun install

# Establecer variables de entorno por defecto
ENV NODE_ENV=development
ENV PORT=3003
ENV JWT_SECRET=my-super-secret-key-1234567890
ENV RABBITMQ_URL=amqp://sample-mono-rabbitmq:5673

# Exponer puerto
EXPOSE 3003

# Comando por defecto: iniciar servidor
CMD ["bun", "run", "packages/user-service/src/index.ts"]