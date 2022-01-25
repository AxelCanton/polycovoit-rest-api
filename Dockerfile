# syntax=docker/dockerfile:1

FROM node:17.4.0
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm install -g @nestjs/cli

RUN npm run build

CMD [ "npm", "run", "start:prod" ]