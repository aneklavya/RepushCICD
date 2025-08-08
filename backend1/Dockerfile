FROM node:18 AS base

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build


FROM node:18-alpine AS prod


RUN apk add --no-cache curl

WORKDIR /app


COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json






EXPOSE 3000


HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1


CMD ["node", "dist/index.js" ]

