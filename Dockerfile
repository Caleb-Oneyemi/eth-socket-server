# Intial Image
FROM node:18.12.0-alpine AS build

WORKDIR /app

COPY package.json yarn.lock tsconfig.json tsconfig.prod.json ./

RUN yarn install

COPY src ./src

COPY ormconfig.ts ./

RUN yarn build


# Final Image
FROM node:18.12.0-alpine AS final

WORKDIR /app

EXPOSE 7777

ENV NODE_ENV production

RUN apk add --no-cache tini

COPY config ./config

COPY package.json yarn.lock ./

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "dist/src/index.js"]
