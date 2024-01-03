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

If PR is created but not ready for review, its title starts with WIP:
WIP: mus-2: some PR

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

## Project launch on staging mode
main.docker-compose.yml is used for staging.

## Dockerfile
Dockerfile is used for deployment on staging /*and production*/. 
It is not used for development mode. Because in development mode, api is launched separately from docker.

## Docker compose file
serve.docker-compose.yml is used for development mode.
main.docker-compose.yml is used for staging mode.

In development mode, api is not run by serve.docker-compose.yml, but is launched in a separate terminal by the following command:
npm run start:dev

## Github Secrets for deployment on staging
Necessary secrets are added on Github repository page.
Repository > Settings > Secrets and variables > Actions > New repository secret

These are the necessary secrets:
REGISTRY_USERNAME
REGISTRY_PASSWORD
DOCKER_REGISTRY_TEST 
PORTAINER_WEBHOOK_URL_TEST - Weebhook is retrieved from Portainer after stack is deployed. 

## App module configModule.forRoot uses envFilePath:
For deployment on staging via Portainer, it should be:
envFilePath: ["stack.env"]

## Commands:
# To seed:
npm run seed

# To create a new superadmin: 
npm run createSuperAdmin -- -e superadmins@email -p some_password

# The password is recommended to be enclosed by single quotes ('password'):
npm run createSuperAdmin -- -e superadmins@email -p 'some_password'
Because some symbols like exclamation mark (!) inside the password value could be interpreted in a wrong way by bash.

# To drop superadmin's password:
npm run changePasswordSuperAdmin -- -e superadmins@email

## User activation/deactivation
Only a superadmin can (de-)activate users. An admin cannot toggle this mode. A superadmin can toggle the mode only for the admins, but not for superadmins, including himself.

## Migrations:
# Migration Generation:
To generate a new migration, one needs to run the following command:

npm run migration:generate src/migrations/${migrationName}

e.g. npm run migration:generate src/migrations/initialSchema

# Migration Run:
To run migrations, one needs to run the following command:

npm run migration:run.

However, it might be excessive because this command is run automatically, prior to start, on the following commands: 
npm run start:dev
npm run start:prod
