# Build stage
FROM node:22-alpine AS build

RUN apk add --no-cache \
  build-base \
  gcc \
  autoconf \
  automake \
  zlib-dev \
  libpng-dev \
  bash \
  vips-dev \
  git

RUN corepack enable

WORKDIR /opt/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production

RUN pnpm run build


# Production stage
FROM node:22-alpine

RUN apk add --no-cache vips-dev

ENV NODE_ENV=production

RUN corepack enable

WORKDIR /opt/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=build /opt/app ./

RUN chown -R node:node /opt/app

USER node

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:1337/_health || exit 1

CMD ["pnpm", "run", "start"]