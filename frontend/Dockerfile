FROM node:22-alpine AS builder
WORKDIR /full-stack-app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build          # builds static files into /dist folder

FROM nginx:alpine
COPY --from=builder /full-stack-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]