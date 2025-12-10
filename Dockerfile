FROM node:12.19.1-alpine3.12 AS builder

ARG CMD
ARG APP_BASE_URL
ARG APP_WEBSOCKET
ARG APP_AUTH_PAGE
ARG APP_PLATFORM
ARG APP_DEBUG

ENV APP_BASE_URL ${APP_BASE_URL}
ENV APP_WEBSOCKET ${APP_WEBSOCKET}
ENV APP_AUTH_PAGE ${APP_AUTH_PAGE}
ENV APP_PLATFORM ${APP_PLATFORM}
ENV APP_DEBUG ${APP_DEBUG}

WORKDIR /app
COPY package*.json ./
COPY .env ./
COPY .env.* ./
RUN npm config set registry https://registry.npmmirror.com && npm config set @shopex:registry http://registry.npm.ishopex.cn
RUN npm ci

COPY . .
RUN ls -la
RUN ${CMD}
RUN ls -l /app/dist

FROM steebchen/nginx-spa:stable
WORKDIR /app
COPY --from=builder /app/dist .
EXPOSE 80
CMD ["nginx"]
