# Ginko API

## Introduction

This is the API for the Ginko project. It is a RESTful API that allows users to interact with the Ginko database. The API is built using NestJS and Prisma.

## Installation

1. Clone the repository
2. Run `Yarn install` to install the dependencies
3. Create a `.env` file based on the `.env.template` file
4. Run `docker-compose up -d` to start the database
5. Run `yarn prisma migrate dev` to create the database schema
6. Run `yarn start:dev` to start the server
