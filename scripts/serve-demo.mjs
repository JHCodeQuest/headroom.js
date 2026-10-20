import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

// Serve only the demo assets, never repository internals or arbitrary paths.
const assets = new Map([
  ["/", ["../examples/typescript/index.html", "text/html; charset=utf-8"]],
  ["/main.js", ["../examples/typescript/main.js", "text/javascript; charset=utf-8"]],
  ["/dist/headroom.mjs", ["../dist/headroom.mjs", "text/javascript; charset=utf-8"]]
]);
const port = Number(process.env.PORT || 3333);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

createServer(async (request, response) => {
  const asset = assets.get(request.url);
  if (!asset || !["GET", "HEAD"].includes(request.method)) {
    response.writeHead(404).end("Not found");
    return;
  }
  try {
    const content = await readFile(new URL(asset[0], import.meta.url));
    response.writeHead(200, { "Content-Type": asset[1], "Cache-Control": "no-store" });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch {
    response.writeHead(503).end("Run npm run build before starting the demo.");
  }
}).listen(port, "127.0.0.1", () => {
  process.stdout.write(`Headroom example: http://127.0.0.1:${port}\n`);
});
