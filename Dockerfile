FROM node:18.17.0-bullseye as build

WORKDIR /app
COPY . /app
RUN apt-get update && apt-get install -y wget gnupg \
        && wget -qO - https://repo.mysql.com/RPM-GPG-KEY-mysql-2023 | apt-key add - \
        && wget https://dev.mysql.com/get/mysql-apt-config_0.8.22-1_all.deb \
        && dpkg -i mysql-apt-config_0.8.22-1_all.deb \
        && apt-get update \
        && apt-get install -y mysql-client \
        && rm -rf /var/lib/apt/lists/*
RUN npm i
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]