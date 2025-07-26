// import { AuthController } from "./controller/auth.controller";

import { AuthController } from "./controller/auth.controller";

const headers = {
  "Content-Type": "application/json"
};

const router = AuthController(headers as any);

const defaultPort = process.env.PORT || 3002;

Bun.serve({
  port: defaultPort,
  async fetch(req) {
    const url = new URL(req.url);
    const method = req.method;
    const path = url.pathname;

    if (method === "OPTIONS") {
      return new Response(null, { headers });
    }

    const handler = router.get(path);
    if (handler) {
      return handler(req);
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers
    });
  }
});

console.log("Auth Service running at http://localhost:" + defaultPort);