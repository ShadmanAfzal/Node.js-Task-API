### Overview & Purpose

- **Project Description**: This project is built using the Express library and MongoDB as the backend database. Its primary purpose is to provide API endpoints that allow users to create, read, update, and delete tasks and subtasks.

- **Architecture Diagram**:

  ![Architecture Diagram](https://raw.githubusercontent.com/ShadmanAfzal/Node.js-Task-API/main/images/architecture%20diagram.png)

### Codebase Structure

1. **Directory Layout**:

- `/src`: Contains the source code written in TypeScript, which will be compiled into JavaScript.

  - `/controllers`: Contains the logic for handling incoming requests. Controllers process these requests and send responses back to the client.

  - `/db`: Contains Mongoose schemas for users, tasks, and subtasks.

  - `/middlewares`: Includes middleware functions such as request body validators, user authentication, and error handlers.

  - `/routers`: Contains the routing logic, directing incoming requests to the appropriate controllers.

  - `/services`: Contains service classes used by controllers to perform specific actions. Includes services for authentication, tasks, and users.

  - `/types`: Defines custom TypeScript types used throughout the application.

  - `/utils`: Contains utility functions and
    common helpers used across the project.

  - `/app.ts`: Contains the configuration and setup logic for the Express application.

  - `/index.ts`: Contains the code for starting the HTTP server.

- `/dist`: Generated directory containing compiled JavaScript code, created when running `npm run build`. This directory is used to execute the server.

- `/.env`: Contains environment variables required for the application, such as `DATABASE_URL` and `NODE_ENV`.

2. Packages used:

### Dependencies

- **`bcrypt`**: This module is used for hashing passwords and validating hashed passwords against actual passwords. It provides a secure way to handle user authentication by storing passwords in a hashed format.

- **`dotenv`**: This module is used to load environment variables from the `.env` file into the `process.env` object. This helps in managing configuration settings and sensitive information, such as database credentials, in a secure and flexible manner.

- **`express`**: This framework is utilized to create the server and handle incoming user requests. It provides a robust set of features for building web applications and APIs, including routing, middleware support, and request handling.

- **`http-status-codes`**: This package offers constants for common HTTP status codes, making it easier to use standardized status codes in responses. It improves code readability and consistency by providing meaningful names for status codes.

- **`jsonwebtoken`**: This library is used for generating and validating JSON Web Tokens (JWTs). It is essential for implementing authentication and authorization mechanisms, allowing secure communication between parties through token-based authentication.

- **`mongoose`**: This package acts as an Object-Relational Mapping (ORM) tool for MongoDB, facilitating interaction with the database through a higher-level API. It simplifies the process of querying and manipulating MongoDB collections using schemas and models.

- **`morgan`**: This HTTP request logger middleware is used to log details about incoming requests, including the request method, URL, response status code, and response time. It is useful for debugging and monitoring the application’s traffic and performance.

- **`zod`**: This library is employed for validating request objects against predefined schemas. It ensures that incoming data adheres to expected formats and types, helping to maintain data integrity and reduce errors in the application.
