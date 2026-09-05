# Foundation base image (ADR-004). A store builds `FROM foundation:x.y.z` and adds
# its own vendure-config.ts, plugins and assets.
#
# One image, several entrypoints: `start:server` and `start:worker` run the two
# containers of ADR-005. Migrations run inside `start:server`, from `src/index.ts`.

FROM node:22-bookworm-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-bookworm-slim AS runtime

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /usr/src/app/package*.json ./
COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
# Email templates are read from disk at runtime by the EmailPlugin.
COPY --from=builder --chown=node:node /usr/src/app/static ./static

USER node

CMD ["npm", "run", "start:server"]
