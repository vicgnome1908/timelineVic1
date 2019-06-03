FROM node:latest

RUN apt update && apt upgrade -y

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g prisma

RUN npm install

COPY . .

RUN chmod -R +x ./docker-scripts/

ENTRYPOINT [ "./docker-scripts/entrypoint.sh" ]
