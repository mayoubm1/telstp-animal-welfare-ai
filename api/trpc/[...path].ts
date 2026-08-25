import type { IncomingMessage, ServerResponse } from "node:http";

type NodeHandler = (req: IncomingMessage, res: ServerResponse) => void;

let appPromise: Promise<NodeHandler> | undefined;

async function getApp(): Promise<NodeHandler> {
  if (!appPromise) {
    appPromise = (async () => {
      const [expressModule, trpcModule, routerModule, contextModule] = await Promise.all([
        import("express"),
        import("@trpc/server/adapters/express"),
        import("../../server/routers.js"),
        import("../../server/_core/context.js"),
      ]);
      const express = expressModule.default;
      const app = express();
      const trpcMiddleware = trpcModule.createExpressMiddleware({
        router: routerModule.appRouter,
        createContext: contextModule.createContext,
      });

      app.use((req, res, next) => {
        if (req.url === "/api/trpc") req.url = "/api/trpc/";
        trpcMiddleware(req, res, next);
      });

      return app as unknown as NodeHandler;
    })();
  }

  return appPromise;
}

export default async function vercelTrpcHandler(req: IncomingMessage, res: ServerResponse) {
  try {
    const app = await getApp();
    app(req, res);
  } catch (error) {
    console.error("[Vercel tRPC bootstrap]", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "The API is temporarily unavailable. Please retry shortly." }));
  }
}
