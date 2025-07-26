# Usar imagen ligera de Bun
FROM oven/bun:slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y bun.lockb del monorepo
COPY package.json bun.lockb* ./

# Copiar paquetes necesarios
COPY packages/auth-service ./packages/auth-service
COPY packages/core ./packages/core
COPY packages/db ./packages/db

# Instalar dependencias
RUN bun install

# Establecer variables de entorno por defecto
ENV NODE_ENV=development
ENV PORT=3002
ENV JWT_SECRET=my-super-secret-key-1234567890
ENV RABBITMQ_URL=amqp://sample-mono-rabbitmq:5672

# Exponer puerto
EXPOSE 3002

# Comando por defecto: iniciar servidor
CMD ["bun", "run", "packages/auth-service/src/index.ts"]