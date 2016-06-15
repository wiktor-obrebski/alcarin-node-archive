FROM node:5.10.1
MAINTAINER psychowico <psychowico@gmail.com>

RUN apt-get update && apt-get install -y postgresql-client
RUN npm install -g pg node-pg-migrate

WORKDIR /app
