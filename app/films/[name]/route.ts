import { getCloudflareContext } from "@opennextjs/cloudflare";

// Serves the films with HTTP Range support. Workers static assets answer Range requests with a full 200,
// and Safari refuses to play video that way, so the files live in /film-files and stream through here.

type AssetsEnv = { ASSETS?: { fetch: (input: string | Request) => Promise<Response> } };

const NAME = /^[a-z0-9_]+\.mp4$/;

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!NAME.test(name)) return new Response("Not found", { status: 404 });

  const url = new URL(`/film-files/${name}`, request.url);
  const { env } = await getCloudflareContext({ async: true });
  const assets = (env as AssetsEnv).ASSETS;
  const source = assets ? await assets.fetch(url.toString()) : await fetch(url);
  if (!source.ok) return new Response("Not found", { status: 404 });

  const body = await source.arrayBuffer();
  const size = body.byteLength;
  const headers = {
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  const range = request.headers.get("range")?.match(/^bytes=(\d*)-(\d*)$/);
  if (!range) return new Response(body, { headers: { ...headers, "Content-Length": String(size) } });

  let start = range[1] ? Number(range[1]) : size - Number(range[2]);
  let end = range[1] && range[2] ? Number(range[2]) : size - 1;
  start = Math.max(0, start);
  end = Math.min(end, size - 1);
  if (start > end) {
    return new Response(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${size}` } });
  }
  return new Response(body.slice(start, end + 1), {
    status: 206,
    headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
  });
}
