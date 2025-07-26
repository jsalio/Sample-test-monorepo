import { AuthController } from "./controller/auth.controller";
import { AccountController } from "./controller/account.controller";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400" // 24 hours
};

const combineRouters = () => {
  const combined: Map<string, (req: Request, params?: Record<string, string>) => Promise<Response>> = new Map();

  const routers = [AuthController(headers as any), AccountController(headers as any)];
  for (const router of routers) {
    for (const [path, handler] of router) {
      combined.set(path, handler);
    }
  }

  return combined;
};

const router = combineRouters();

const defaultPort= process.env.PORT || 3001;


Bun.serve({
  port: defaultPort,
  async fetch(req) {
    const url = new URL(req.url);
    const method = req.method;
    const path = url.pathname;

    if (method === "OPTIONS") {
      return new Response(null, { headers });
    }
    // Manejar rutas dinámicas (:id)
    for (const [routePath, handler] of router) {
      const routeRegex = new RegExp(`^${routePath.replace(/:id/, "([^/]+)")}$`);
      const match = path.match(routeRegex);
      if (match) {
        const params = { id: match[1] };
        return handler(req, params);
      }
    }
    const handler = router.get(path);
    if (handler) {
      return handler(req);
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { 
      status: 404,
      headers: headers
    });
  },
});
console.log("Server running at http://localhost:" + defaultPort);