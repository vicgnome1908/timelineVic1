#FROM node:latest
#
#RUN apt update && apt upgrade -y

FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk update && apk upgrade && apk --no-cache --virtual build-dependencies add python make g++ \
&& npm install -g prisma && npm install \
&& apk del build-dependencies

COPY . .

RUN chmod -R +x ./docker-scripts/

ENTRYPOINT [ "./docker-scripts/entrypoint.sh" ]
