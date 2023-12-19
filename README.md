# MASHROOMS-API


## NestJS:
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## GIT
Git branches are named after the relevant Jira tasks. For example:
mus-2

Git commits start with the Jira task. For example:
mus-2: some commit

Git pull requests are headed with the Jira task. For example:
mus-2: some PR

## Connecting docker MySQL and PhpMyAdmin containers with NestJS (which is outside docker)
PMA_HOST - host of mysql inside docker needed for PhpMyAdmin container
PMA_PORT - port of mysql inside docker needed for PhpMyAdmin container

MYSQL_NODE_HOSTNAME - external host on the local machine or server, used in NestJS app.module.ts
MYSQL_TCP_PORT - external port on the local machine or server, used in NestJS app.module.ts

## Project launch on development mode
One needs .env file in the root folder with the variables specified in .env.example file in root folder.

- In one terminal, one needs to launch the docker-compose file by running the following command: 
  docker-compose -f serve.docker-compose.yml up

- In another terminal, one needs to launch NestJS:
  npm run start:dev

## Project launch on production mode
One needs to follow the comments in the src/main.ts to adapt the code for production mode, first.
One needs to use Dockerfile, which is temporary named as _Dockerfile to run NestJS application in Docker.

