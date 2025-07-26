import amqp from "amqplib";
import { AccountController } from "./controller/account.controller";

const headers = {
  "Content-Type": "application/json"
};

let rabbitChannel: amqp.Channel | null = null;
async function initRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://sample-mono-rabbitmq:5672");
    rabbitChannel = await connection.createChannel();
    await rabbitChannel.assertQueue("user-queue", { durable: false });
    await rabbitChannel.assertQueue("user-response-queue", { durable: false });
    console.log("Connected to RabbitMQ");

    const router = AccountController(headers as any);
    rabbitChannel.consume("user-queue", async (msg) => {
      if (msg && rabbitChannel) {
        const { method, path, body, params, headers: reqHeaders } = JSON.parse(msg.content.toString());
        const request = new Request(`http://localhost${path}`, {
          method,
          headers: new Headers(reqHeaders),
          body: method !== "GET" ? JSON.stringify(body) : undefined
        });

        const routeRegex = new RegExp(`^${path.replace(/:id/, "([^/]+)")}$`);
        const match = path.match(routeRegex);
        const handler = router.get(path) || (match ? router.get("/api/account/user/:id") || router.get("/api/account/update/:id") : null);

        if (handler) {
          const response = await handler(request, match ? { id: match[1] } : undefined);
          const responseBody = await response.json();
          rabbitChannel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(responseBody)), {
            correlationId: msg.properties.correlationId
          });
        } else {
          rabbitChannel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify({ error: "Not Found" })), {
            correlationId: msg.properties.correlationId
          });
        }
      }
    }, { noAck: true });
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
  }
}

initRabbitMQ();

const defaultPort = process.env.PORT || 3003;

Bun.serve({
  port: defaultPort,
  async fetch() {
    return new Response(JSON.stringify({ status: "User Service running" }), {
      status: 200,
      headers
    });
  }
});

console.log("User Service running at http://localhost:" + defaultPort);