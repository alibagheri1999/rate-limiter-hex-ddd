## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [Installation](#installation) for notes on how to deploy the project on a live system.

## Prerequisites

Before you can run the project, you need to have the following software installed on your system:

- Docker

You can download and install Docker from the [official Docker website](https://docker.com/).

## Installation

Navigate to the project directory:

```bash
cd rate-limiter
```

## Notices!!!
if you don't have docker engine running on your local machine do these steps:
### create .env from .env.exaple and change the env file
```bash
cd ./src/deploy/env
```
### run the script
```bash
npm run start:prod
```

## Running the docker file
in the root of project
```bash
npm run docker:build
```

## Running the Application
go to scripts folder
```bash
cd ./src/deploy/scripts
```
Then run => "run" run.sh file to run in development mode

```bash
bash run.sh run
```
run => "log" run.sh file to see logs

```bash
bash run.sh log
```
run => "down" run.sh file to makes containers down 

```bash
bash run.sh down
```
* Please make sure that .sh files in scripts folder have right permissions for execution.

## Project Structure

Below is an overview of the project structure:

```
rate-limit/
├── src/
│   ├── cmd/
│   │   ├── DI/
│   │   │   ├── index.ts
│   │   │   └── inversify.config.ts
│   │   ├── doc/
│   │   │   ├── generator.ts
│   │   │   ├── index.ts
│   │   │   └── swagger/
│   │   │       ├── routes.js
│   │   │       └── schema.js
│   │   ├── gateway/
│   │   │   ├── http/
│   │   │   │   ├── controllers/
│   │   │   │   │   ├── api.http
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── user.controller.ts
│   │   │   │   ├── middlewares/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── rateLimiter.middleware.ts
│   │   │   │   │   └── responseHandler.middleware.ts
│   │   │   │   ├── routes/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── user.routes.ts
│   │   │   │   ├── router/
│   │   │   │   │   └── index.ts
│   │   │   │   └── server/
│   │   │   │       └── index.ts
│   │   │   └── index.ts
│   │   ├── index.ts
│   │   ├── pathResolver.ts
│   │   └── serve.ts
│   ├── deploy/
│   │   ├── config.ts
│   │   ├── env/
│   │   │   ├── environment.d.ts
│   │   │   ├── .env
│   │   │   └── sample.env
│   │   ├── index.ts
│   │   ├── scripts/
│   │   │   ├── dev-docker-compose.yml
│   │   │   └── run.sh
│   │   └── type.ts
│   ├── internal/
│   │   ├── adapters/
│   │   │   ├── cache/
│   │   │   │   ├── index.ts
│   │   │   │   └── redis/
│   │   │   │       └── redis.cache.ts
│   │   │   ├── repository/
│   │   │   │   ├── index.ts
│   │   │   │   ├── postgres/
│   │   │   │   │   └── user.repository.ts
│   │   │   │   └── redis/
│   │   │   │       └── cache.repository.ts
│   │   │   └── store/
│   │   │       ├── index.ts
│   │   │       └── postgres/
│   │   │           └── postgres.store.ts
│   │   ├── application/
│   │   │   ├── services/
│   │   │   │   ├── index.ts
│   │   │   │   └── user/
│   │   │   │       ├── index.ts
│   │   │   │       └── user.service.ts
│   │   │   └── utils/
│   │   │       ├── functions.ts
│   │   │       ├── index.ts
│   │   │       └── log/
│   │   │           ├── index.ts
│   │   │           ├── logger.ts
│   │   │           ├── prefix.ts
│   │   │           └── writer.ts
│   │   ├── domain/
│   │   │   ├── dto/
│   │   │   │   └── index.ts
│   │   │   ├── entity/
│   │   │   │   ├── index.ts
│   │   │   │   └── user.entity.ts
│   │   │   ├── model/
│   │   │   │   ├── index.ts
│   │   │   │   └── user.ts
│   │   │   └── types/
│   │   │       ├── DI.types.ts
│   │   │       ├── expressError.ts
│   │   │       ├── expressRequest.ts
│   │   │       ├── expressResponse.ts
│   │   │       ├── globalResponse.ts
│   │   │       ├── httpRoutes.ts
│   │   │       ├── httpStatusCode.ts
│   │   │       ├── httpStatusMessage.ts
│   │   │       ├── index.ts
│   │   │       ├── repositoryResult.ts
│   │   │       ├── request.d.ts
│   │   │       └── strings.ts
│   │   └── ports/
│   │       ├── cacheRepository.port.ts
│   │       ├── controller.port.ts
│   │       ├── index.ts
│   │       ├── repository.port.ts
│   │       ├── routes.port.ts
│   │       ├── store.port.ts
│   │       ├── user.service.port.ts
│   │       └── userRepository.port.ts
│   ├── migrations/
│   │   ├── 0_add_users_table.sql
│   │   ├── 1_add_random_users.sql
│   │   ├── index.ts
│   │   └── migrator.ts
│   ├── test/
│   │   ├── serve.ts
│   │   ├── unit/
│   │   │   ├── rate-limit.spec.ts
│   │   │   └── user-service.spec.ts
│   │   └── ...
│   └── ...
└── README.md
```

## Tests

To run the test suite, execute the following command:

```bash
npm run test
```
