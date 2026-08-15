import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

const app = express();
const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
});

app.use((req, res, next) => {
  if (req.url === "/api/trpc") {
    req.url = "/api/trpc/";
  }
  trpcMiddleware(req, res, next);
});

export default app;
