FROM node:20.18.0-bullseye as build

WORKDIR /app
COPY . /app
COPY package*.json /app
COPY package-lock.json /app
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*
RUN npm i
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]