FROM node:18.17.0-bullseye as build

WORKDIR /app
COPY . /app
RUN apt update && apt install -y mysql-client && rm -rf /var/lib/apt/lists/*
RUN npm i
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]