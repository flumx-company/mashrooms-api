FROM node:18.17.0-bullseye as build

WORKDIR /app
COPY . /app
RUN apt-get update && apt-get install -y wget lsb-release \
    && wget https://dev.mysql.com/get/mysql-apt-config_0.8.20-1_all.deb \
    && dpkg -i mysql-apt-config_0.8.20-1_all.deb \
    && apt-get update \
    && apt-get install -y mysql-client \
    && rm -rf /var/lib/apt/lists/*
RUN npm i
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]