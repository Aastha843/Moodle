ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules

COPY . .
RUN npx prisma generate

RUN npm run build

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/prisma ./prisma

RUN npx prisma generate

EXPOSE 3000
USER nextjs
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
