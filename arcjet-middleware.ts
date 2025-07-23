// arcjet-middleware.ts
import { createMiddleware, detectBot, shield } from "@arcjet/next";
import aj from "./lib/arcjet";

const validate = aj
  .withRule(shield({ mode: 'LIVE' }))
  .withRule(detectBot({ mode: 'LIVE', allow: ['CATEGORY:SEARCH_ENGINE', 'G00G1E_CRAWLER'] }));

export default createMiddleware(validate);

export const config = {
  matcher: ['/some-bot-sensitive-routes/*'] // adjust as needed
};
