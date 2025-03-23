// server.js
import { serve } from "https://deno.land/std/http/server.ts";
import { join, extname } from "https://deno.land/std/path/mod.ts";
import { contentType } from "https://deno.land/std/media_types/mod.ts";

const BUILD_DIR = join(Deno.cwd(), "build");

export async function handler(req) {
  const url = new URL(req.url);
  let filePath = join(BUILD_DIR, url.pathname);

  // Handle root path and fallback to index.html for HTML5 routing
  if (url.pathname === "/" || url.pathname.endsWith("/")) {
    filePath = join(filePath, "index.html");
  } else {
    try {
      const fileStat = await Deno.stat(filePath);
      if (fileStat.isDirectory) {
        filePath = join(filePath, "index.html");
      }
    } catch {
      filePath = join(BUILD_DIR, "index.html"); // Fallback for HTML5 history API routing
    }
  }

  try {
    const file = await Deno.readFile(filePath);
    const mimeType = contentType(extname(filePath)) || "application/octet-stream";

    return new Response(file, {
      headers: { "content-type": mimeType },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new Response("404 - Not Found", { status: 404 });
  }
}
