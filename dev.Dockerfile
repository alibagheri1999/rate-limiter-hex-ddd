FROM node:lts-buster

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
