import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import handler from "../api/trpc/[...path]";

const servers: ReturnType<typeof createServer>[] = [];

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        })
    )
  );
});

describe("Vercel tRPC function adapter", () => {
  it("routes the public auth.me procedure through /api/trpc/*", async () => {
    const server = createServer(handler);
    servers.push(server);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));

    const address = server.address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${address.port}/api/trpc/auth.me`);
    const body = (await response.json()) as { result?: { data?: { json?: unknown } } };

    expect(response.status).toBe(200);
    expect(body.result?.data?.json).toBeNull();
  });
});
