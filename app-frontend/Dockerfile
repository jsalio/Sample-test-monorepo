# Usar imagen ligera de Node.js
FROM node:18-slim

# Instalar Angular CLI globalmente
# Asegúrate de que la versión de Angular CLI sea compatible con tu proyecto
# Si necesitas una versión específica, cámbiala aquí
# Por ejemplo, si necesitas la versión 12.0.0, cambia a:
# RUN npm install -g @angular/cli@12.0.0
RUN npm install -g @angular/cli

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto para Angular (servidor de desarrollo)
EXPOSE 4200

# Comando por defecto: iniciar servidor de desarrollo con host 0.0.0.0
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]