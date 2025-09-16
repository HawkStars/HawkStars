FROM node:20-slim

WORKDIR /app

RUN corepack enable pnpm && corepack install -g pnpm@latest-10

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch --prod

ENV CI=true
ADD . ./
RUN pnpm install --frozen-lockfile

# Option A: Set NODE_OPTIONS environment variable
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm build

EXPOSE 8000
CMD [ "pnpm", "start" ]