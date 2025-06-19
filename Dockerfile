FROM node:20-alpine

ARG APP_PORT=3018

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${APP_PORT}

CMD ["npm", "run", "dev"]
