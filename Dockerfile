# Multi-stage build for the Next.js standalone server (SPEC §2 deploy → EC2).
# Produces a small runtime image that serves the app on :3000. Put Nginx in
# front for TLS / routing (see deploy/nginx.conf, docker-compose.yml).

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Use `npm install` rather than `npm ci`: styled-jsx declares an optional peer
# `@swc/helpers >=0.5.17` while next pins exactly 0.5.15, which older npm
# resolves strictly and fails `npm ci` on. install resolves this leniently.
RUN npm install --no-audit --no-fund

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as a non-root user.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Standalone output bundles the server + traced node_modules; static assets and
# public/ must be copied alongside it.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
