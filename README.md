# Express Application

This is an Express application built using TypeScript, Mongoose, and other modern web development tools. The application includes several key features, such as authentication, user management, and task management, all backed by a MongoDB database.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Design](#database-design)
- [Code Style and Linting](#code-style-and-linting)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ShadmanAfzal/Node.js-Task-API.git
   cd Node.js-Task-API
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **How to generate JWT_SIGN_KEY**

Open REPL by typing below command

```bash
node
```

Copy and paste below command to generate a unique UUID as jwt secret

```bash
require('crypto').randomUUID();
```

4. **Set up environment variables:**

Create a `.env` file in the root folder and copy and replace the values from `.sample.env` file.

OR copy and replaces the values from the below to `.env` file

```
PORT=8000
NODE_ENV=development
DATABASE_URL=<your-mongodb-uri>
JWT_SIGN_KEY=<your-jwt-secret>
```

## Configuration

1. **TypeScript**: The application is written in TypeScript to leverage static typing and improved developer experience.

2. **Mongoose**: Mongoose is used as the ODM (Object Data Modeling) library to interact with MongoDB.

3. **Zod**: Zod is used for schema validation to ensure the integrity and correctness of incoming data.

4. **Google TypeScript Style**: The project follows the Google TypeScript Style Guide (gts) for linting and formatting.

## Running the Application

### To start the server in development mode:

1. To start build process

   ```bash
   npm run dev:build
   ```

2. To start the development server

   ```bash
   npm run dev:start
   ```

### To start the server in production mode:

```bash
npm run dev:start
```
