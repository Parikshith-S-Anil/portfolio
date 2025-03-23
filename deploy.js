// deploy.js
import { serve } from "https://deno.land/std/http/server.ts";
import { handler } from "./server.js"; // Importing the handler from server.js

console.log("HTTP server running on http://localhost:8000");
serve(handler, { port: 8000 });
