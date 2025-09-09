// src/app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// ✅ теперь TypeScript видит свойства GET/POST
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // (опционально) config: { token: "..." }
});
