FROM node:16 as builder

WORKDIR /usr/src/ait-collab

COPY api api

WORKDIR /usr/src/ait-collab/api

RUN yarn

COPY api /usr/src/ait-collab/api/dist

FROM nginx:1.21-alpine

COPY ./api/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/ait-collab/api/ /usr/share/nginx/html
