# TravelBuddy

TravelBuddy is a backend, for an application where you can find your next travel buddy.
A frontend might be created in the future, but for now only the backend is being created.

## How to run

### Prerequisites

- npm (I am using version 8.19.2)
- node (I am using version 19.0.0)
- docker (I am using version 20.10.21)
- docker-compose (I am using version 1.29.2)

### Running the system

- clone repository
- create a `.env` in the root of the project
- Copy the following into the file and input your own values:
  ```
  ENV=development
  DATABASE_USERNAME=SOME_USERNAME
  DATABASE_PASSWORD=SECRET_PASSWORD
  DATABASE_PORT=27017
  PORT=3000
  JWT_KEY=SUPER_SECRET_KEY
  ```
- run `npm install`
- run `docker-compose -f docker-compose.dev.yml up` to start PostgresQL
- run `npm start`
- The API is now accessible at http://localhost:3000/ (or the port that you specified in .env)
- Documentation can be found in the GraphQL Playground at http://localhost:3000/graphql

## Technologies

The system architecture will be a monolith containing 3 layers: Resolver layer, service layer, and data access layer. This will allow for high decoupling, adaptability, and software that is maintainable.

The resolver layer will receive the incomming request, and call the relevant service. The services will contain all "business" logic, and will be written to be as reusable as possible. The data access layer will be containing of the framework TypeOrm, which will handle database access.
The system will take advantage of the dependency injection used through the NestJS framework.
The backend will be creating using the following technologies:

- Typescript
- NodeJS
- NestJS
- GraphQL
- Apollo
- PostgresQL
- TypeOrm

The system will be end-to-end tested using a testing framework that is to be determined.

## Some of the features are:

- Authentication (username, password)
- JWT tokens to handle auth.
- CRUD operations where you can
  - Create / update your own user with a username, password, and small description.
  - Create a new trip, specifying where, how long, how many travel buddies you are looking for and when. The trip might also have a cover photo.
  - Editing an existing trip.
  - Commenting on a specifc trip.
  - Adding yourself as a potential travel buddy to anothers trip.
  - Accepting a travel buddy on your own trip. The trips travels buddies will be immutable once the trip is no longer "openForMoreTravelBuddies".
  - More might be added as the scope is determined along the way.
