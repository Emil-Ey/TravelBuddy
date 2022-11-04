# TravelBuddy

TravelBuddy is a backend, for an application where you can find your next travel buddy.
A frontend might be created in the future, but for now only the backend is being created.

## How to run

### Prerequisites

- npm (I am using version 8.19.2)
- node (I am using version 19.0.0)

### Running the system

- clone repository
- create a `.env` in the root of the project
- Copy the following into the file and input your own values for X, Y, Z:
  ```
  ENV=development
  DATABASE_USERNAME=X
  DATABASE_PASSWORD=Y
  DATABASE_PORT=27017
  PORT=3000
  ```
- run `npm install`
- run `docker-compose -f docker-compose.dev.yml up` to start MongoDB
- run `npm start`
- The API is now accessible at http://localhost:3000/ (or the port that you specified in .env)
- Documentation can be found in the GraphQL Playground at http://localhost:3000/graphql

## Technologies

The system architecture will be a monolith containing 3 layers: Controller layer, service layer, and data access layer. This will allow for high decoupling and adaptability, and software that is maintainable.
The system will take advantage of the dependency injection used through the NestJS framework.
The backend will be creating using the following technologies:

- Typescript
- NodeJS
- NestJS
- GraphQL
- Apollo
- MongoDB
- TypeOrm

The system will be end-to-end tested using a testing framework that is to be determined.

## Some of the features are:

- Authentication (username, password)
- Third party authentication (with Google)
- JWT tokens to handle auth.
- CRUD operations where you can
  - Creating / updating your own user with a profile picture, small description, and other information.
  - Create a new trip, specifying where, how long, how many travel buddies you are looking for and when. The trip might also have a cover photo.
  - Editing an existing trip.
  - Commenting on a specifc trip.
  - Adding yourself as a potential travel buddy to anothers trip.
  - Accepting a travel buddy on your own trip. If the max number of travel buddies is reached, no more travel buddies can be found.
  - More might be added as the scope is determined along the way.
