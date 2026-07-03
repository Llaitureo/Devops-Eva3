FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine
ENV ENTORNO=prod
COPY nginx.conf /tmp/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8083

CMD ["/bin/sh", "-c", "envsubst '${ENTORNO}' < /tmp/nginx.conf > /tmp/default.conf && exec nginx -c /tmp/default.conf -g 'daemon off;'"]
