# Task/Sub-Task CRUD Application

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

Open node in `REPL` mode and Copy and paste below command to generate a unique UUID as jwt secret

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

1. To start the build process

   ```bash
   npm run dev:build
   ```

2. To start the development server

   ```bash
   npm run dev:start
   ```

### To start the server in production mode:

```bash
npm run build
npm run start
```

### API Endpoints

The following API endpoints are available:

For detailed documentation head over to https://documenter.getpostman.com/view/37598490/2sAXqmB5iA

#### Health Check:

- GET `/health` - Returns the status of the application.

#### Authentication:

- POST `/auth/login` - Authenticate a user and return a JWT.
- POST `/auth/register` - Register a new user.

#### User Management:

- GET `/user/me` - Get details of the logged in user.

#### Task Management:

- GET `/tasks` - Get all tasks for the authenticated user.
- POST `/tasks` - Create a new task.
- GET `/tasks/:taskId` - Get a task by its ID.
- PUT `/tasks/:taskId` - Update a task.
- DELETE `/tasks/:taskId` - Soft-delete a task.
- GET `tasks/:taskId/subtasks` - Get all sub-tasks for a task Id.
- POST `tasks/:taskId/subtasks` - Create new sub-tasks for a task id.
- PUT `tasks/:taskId/subtasks` - Update sub-tasks.
- DELETE `tasks/:taskId/subtasks/:subTaskId` - Soft-delete a sub-task.

## Database Design

#### MongoDB Schema

##### User Schema

```typescript
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: [TaskSchema],
});
```

- name: The name of the user.
- email: The unique email address of the user.
- password: The hashed password for authentication.
- tasks: An list of tasks associated with the user.

##### Task Schema

```typescript
const TaskSchema = new Schema({
  subject: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.PENDING,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  subtasks: {
    type: [SubtaskSchema],
    default: [],
  },
});
```

- subject: The title or subject of the task.
- deadline: The due date for the task (YYYY-MM-DD format).
- status: The current status of the task (e.g., `Pending`, `In Progress`, `Completed`).
- isDeleted: Indicates whether the task is soft-deleted.
- subtasks: An array of subtasks associated with the task.

##### Subtask Schema

```typescript
const SubtaskSchema = new Schema({
  subject: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.PENDING,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
```

- subject: The title or subject of the task.
- deadline: The due date for the task (YYYY-MM-DD format).
- status: The current status of the task (e.g., `Pending`, `In Progress`, `Completed`).
- isDeleted: Indicates whether the task is soft-deleted.
- subtasks: An array of subtasks associated with the task.

#### Relationships

**User and Task**: A user can have multiple tasks. The tasks field in the UserSchema stores an array of tasks associated with the user.

**Task and Subtasks**: A task can have multiple subtasks. The subtasks field in the TaskSchema stores an array of subtasks associated with the task.

## Code Style and Linting

This project uses [gts](https://github.com/google/gts) for code style and linting. Ensure that your code adheres to this style by running the following commands:

#### To lint the codebase:

```bash
npm run lint
```

#### To fix the formatting:

```bash
npm run fix
```
