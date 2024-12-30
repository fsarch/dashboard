FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json ./

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache \
        python3 \
        make \
        g++ \
        libc6-compat \
        git \
        build-base \
        cairo-dev \
        pango-dev \
        giflib-dev \
        jpeg-dev \
        libpng-dev

RUN npm ci

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./

# Install dependencies only when needed
FROM base AS deps-prod
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV production

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./

RUN apk add --no-cache \
        python3 \
        make \
        g++ \
        libc6-compat \
        git \
        build-base \
        cairo-dev \
        pango-dev \
        giflib-dev \
        jpeg-dev \
        libpng-dev
RUN npm ci

# Rebuild the source code only when needed
FROM deps-prod AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY .eslintrc.json ./
COPY next.config.mjs ./
COPY tsconfig.json ./
COPY package.json package-lock.json ./

COPY public ./public
COPY src ./src

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache cairo \
                       pango \
                       giflib \
                       jpeg \
                       libpng

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
RUN mkdir -p /app/.next/cache
RUN chown -R nextjs:nodejs /app/.next/cache
COPY --from=builder --chown=nextjs:nodejs --chmod=555 /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs --chmod=555 /app/.next/static ./.next/static
COPY --from=deps-prod --chown=nextjs:nodejs --chmod=555 /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
