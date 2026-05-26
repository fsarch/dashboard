FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache cairo \
                       pango \
                       giflib \
                       jpeg \
                       libpng

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /app/.next/cache && chown -R nextjs:nodejs /app/.next/cache

# Expects prebuilt artifacts in build context:
# - .next/standalone
# - .next/static
# - node_modules
COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static
COPY --chown=nextjs:nodejs node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]

