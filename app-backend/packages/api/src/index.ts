import amqp from "amqplib";
import { v4 as uuidv4 } from "uuid";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400"
};

let rabbitChannel: amqp.Channel | null = null;
// Map para almacenar las promesas pendientes por correlationId
const pendingRequests = new Map<string, { resolve: Function; reject: Function; timeout: NodeJS.Timeout }>();

async function initRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://guest:guest@sample-mono-rabbitmq:5672");
    rabbitChannel = await connection.createChannel();
    
    await rabbitChannel.assertQueue("user-queue", { durable: false });
    await rabbitChannel.assertQueue("user-response-queue", { durable: false });
    
    // Crear el consumer UNA SOLA VEZ durante la inicialización
    await setupResponseConsumer();
    
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
  }
}

async function setupResponseConsumer() {
  if (!rabbitChannel) return;
  
  // Consumer único que maneja todas las respuestas
  await rabbitChannel.consume("user-response-queue", (msg) => {
    if (!msg) return;
    
    const correlationId = msg.properties.correlationId;
    const pendingRequest = pendingRequests.get(correlationId);
    
    if (pendingRequest) {
      // Limpiar el timeout
      clearTimeout(pendingRequest.timeout);
      
      try {
        const response = JSON.parse(msg.content.toString());
        pendingRequest.resolve(response);
      } catch (error) {
        pendingRequest.reject(new Error('Failed to parse response'));
      }
      
      // Remover la promesa pendiente
      pendingRequests.delete(correlationId);
    }
    
    // Acknowledging the message
    rabbitChannel!.ack(msg);
  }, { noAck: false });
}

async function sendToUserService(message: any, timeout: number = 30000): Promise<any> {
  if (!rabbitChannel) throw new Error("RabbitMQ not connected");
  
  const correlationId = uuidv4();
  const replyQueue = "user-response-queue";

  return new Promise((resolve, reject) => {
    // Configurar timeout para evitar promesas colgadas
    const timeoutHandle = setTimeout(() => {
      pendingRequests.delete(correlationId);
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);

    // Almacenar la promesa pendiente
    pendingRequests.set(correlationId, {
      resolve,
      reject,
      timeout: timeoutHandle
    });

    // Enviar el mensaje
    rabbitChannel!.sendToQueue("user-queue", Buffer.from(JSON.stringify(message)), {
      correlationId,
      replyTo: replyQueue,
      persistent: false
    });
  });
}

// Función para limpiar recursos al cerrar la aplicación
process.on('SIGINT', () => {
  console.log('Closing RabbitMQ connection...');
  // Rechazar todas las promesas pendientes
  pendingRequests.forEach((request) => {
    clearTimeout(request.timeout);
    request.reject(new Error('Application shutdown'));
  });
  pendingRequests.clear();
  process.exit(0);
});

const defaultPort = process.env.PORT || 3001;

// Inicializar RabbitMQ antes de iniciar el servidor
initRabbitMQ();

Bun.serve({
  port: defaultPort,
  async fetch(req) {
    const url = new URL(req.url);
    const method = req.method;
    const path = url.pathname;

    if (method === "OPTIONS") {
      return new Response(null, { headers });
    }

    console.log("Method: " + method);
    console.log("Path: " + path);
    console.log("Headers: " + JSON.stringify(req.headers));
    console.log("Body: " + JSON.stringify(process.env));
    

    // Login: Enviar a Auth Service vía HTTP
    if (path === "/api/auth/login" && method === "POST") {
      console.log("Login: Enviar a Auth Service vía HTTP a: "+process.env.AUTH_SERVICE_URL);
      try {
        const response = await fetch(`http://sample-mono-auth:3002/api/auth/login`, {
          method: "POST",
          headers: req.headers,
          body: await req.text()
        });
        return new Response(response.body, {
          status: response.status,
          headers
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: (error as any).message }), {
          status: 500,
          headers
        });
      }
    }

    // Operaciones de usuarios: Enviar a User Service vía RabbitMQ
    const userRoutes = [
      { path: "/api/account/new", method: "POST" },
      { path: "/api/account/users", method: "GET" },
      { path: "/api/account/user/:id", method: "GET" },
      { path: "/api/account/update/:id", method: "PUT" },
      { path: "/api/account/update-password", method: "PATCH" }
    ];

    for (const route of userRoutes) {
      const routeRegex = new RegExp(`^${route.path.replace(/:id/, "([^/]+)")}$`);
      const match = path.match(routeRegex);
      if (method === route.method && (path === route.path || match)) {
        try {
          const body = method !== "GET" ? await req.json() : {};
          const params = match ? { id: match[1] } : {};
          const message = { method, path, body, params, headers: Object.fromEntries(req.headers) };
          
          const result = await sendToUserService(message);
          
          return new Response(JSON.stringify(result), {
            status: result.success ? (path === "/api/account/new" ? 201 : 200) : 400,
            headers
          });
        } catch (error) {
          console.error("Error processing user service request:", error);
          return new Response(JSON.stringify({ error: (error as any).message }), {
            status: 500,
            headers
          });
        }
      }
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers
    });
  }
});

console.log("API Gateway running at http://localhost:" + defaultPort);