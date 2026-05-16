FROM node:22-alpine
WORKDIR /full-stack-app
copy . .
RUN npm install
EXPOSE 5000
CMD [ "node", "server.js" ]