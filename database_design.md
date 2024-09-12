## Database design document

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

#### Sample data

```json
{
  "_id": {"$oid": "66e07d10ccf792ee1a6975fd"},
  "name": "Shadman Afzal",
  "email": "shadman.afzal.7@gmail.com",
  "password": "$2b$08$uzQyKHBID0ixb/7J3oczk.fstuUM0IZEs5LTsNqH9Me3xWztUmNoK",
  "tasks": [
    {
      "subject": "Hack2Skills Task 2",
      "deadline": {"$date": {"$numberLong": "1728691200000"}},
      "status": "Pending",
      "isDeleted": false,
      "_id": {"$oid": "66e1a645f65029e36224075e"},
      "subtasks": [
        {
          "subject": "Test sub tasks 3 - Updated",
          "deadline": {"$date": {"$numberLong": "1728691200000"}},
          "status": "Pending",
          "isDeleted": false,
          "_id": {"$oid": "66e1a650f65029e362240764"}
        },
        {
          "subject": "Test sub tasks 2 - Updated",
          "deadline": {"$date": {"$numberLong": "1728691200000"}},
          "status": "In Progress",
          "isDeleted": true,
          "_id": {"$oid": "66e1a650f65029e362240765"}
        }
      ]
    },
    {
      "subject": "Test Tasks Updated 2",
      "deadline": {"$date": {"$numberLong": "1728691200000"}},
      "status": "In Progress",
      "isDeleted": false,
      "_id": {"$oid": "66e1ac1ea8b332381af166ff"},
      "subtasks": [
        {
          "subject": "Hack2Skills sub-tasks 1",
          "deadline": {"$date": {"$numberLong": "1728691200000"}},
          "status": "Pending",
          "isDeleted": false,
          "_id": {"$oid": "66e1accfa8b332381af16712"}
        },
        {
          "subject": "Hack2Skills sub-tasks 2",
          "deadline": {"$date": {"$numberLong": "1728864000000"}},
          "status": "In Progress",
          "isDeleted": false,
          "_id": {"$oid": "66e1accfa8b332381af16713"}
        }
      ]
    },
    {
      "subject": "Hack2Skills",
      "deadline": {"$date": {"$numberLong": "1728691200000"}},
      "status": "Pending",
      "isDeleted": false,
      "_id": {"$oid": "66e1b1dc3fd37ec085f5872d"},
      "subtasks": [
        {
          "subject": "Hack2Skills sub-tasks 1",
          "deadline": {"$date": {"$numberLong": "1728691200000"}},
          "status": "Pending",
          "isDeleted": false,
          "_id": {"$oid": "66e2854f04b258580a3e637a"}
        },
        {
          "subject": "Hack2Skills sub-tasks 2",
          "deadline": {"$date": {"$numberLong": "1728691200000"}},
          "status": "Pending",
          "isDeleted": true,
          "_id": {"$oid": "66e2854f04b258580a3e637b"}
        }
      ]
    },
    {
      "subject": "Hack2Skills",
      "deadline": {"$date": {"$numberLong": "1728691200000"}},
      "status": "Completed",
      "isDeleted": true,
      "_id": {"$oid": "66e284c704b258580a3e635b"},
      "subtasks": []
    },
    {
      "subject": "Hack2Skills",
      "deadline": {"$date": {"$numberLong": "1728691200000"}},
      "status": "Pending",
      "isDeleted": false,
      "_id": {"$oid": "66e286bc84d7173b48dc50dc"},
      "subtasks": []
    }
  ],
  "__v": {"$numberInt": "0"}
}
```
