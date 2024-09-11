import {z} from 'zod';
import mongoose from 'mongoose';

import User from '../db';
import UserService from './user';
import {
  createSubTaskSchema,
  createTaskSchema,
  updateSubTaskSchema,
} from '../utils/validation-schema/task';
import {filterTask} from '../utils/helper/filterRecords';

class TaskService {
  userService: UserService;
  constructor() {
    this.userService = new UserService();
  }
  async createTask(taskBody: z.infer<typeof createTaskSchema>, userId: string) {
    const taskId = new mongoose.Types.ObjectId();

    await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $push: {
          tasks: {
            ...taskBody,
            _id: taskId,
          },
        },
      }
    );

    return await this.getTaskById(userId, taskId.toString());
  }

  async getTaskByUser(userId: string) {
    const user = await User.findById(userId).lean();

    return filterTask(user?.tasks);
  }

  async getTaskById(userId: string, taskId: string) {
    const user = await User.findOne(
      {
        _id: userId,
        'tasks._id': taskId,
        'tasks.isDeleted': false,
      },
      {
        tasks: {
          $elemMatch: {
            _id: taskId,
            isDeleted: false,
          },
        },
      }
    ).lean();

    return filterTask(user?.tasks)?.at(0);
  }

  async updateTask(
    task: z.infer<typeof createTaskSchema>,
    taskId: string,
    userId: string
  ) {
    await User.updateOne(
      {
        _id: userId,
        'tasks._id': taskId,
      },
      {
        $set: {
          'tasks.$.status': task.status,
          'tasks.$.deadline': task.deadline,
          'tasks.$.subject': task.subject,
        },
      }
    );

    return this.getTaskById(userId, taskId);
  }

  async deleteTask(userId: string, taskId: string) {
    await User.updateOne(
      {
        _id: userId,
        'tasks._id': taskId,
      },
      {
        $set: {
          'tasks.$.isDeleted': true,
        },
      }
    );
  }

  async getSubTasksByTaskId(userId: string, taskId: string) {
    const task = await this.getTaskById(userId, taskId);

    return task?.subtasks;
  }

  async addSubTasks(
    tasks: z.infer<typeof createSubTaskSchema>,
    userId: string,
    taskId: string
  ) {
    await User.findOneAndUpdate(
      {
        _id: userId,
        'tasks._id': taskId,
      },
      {$push: {'tasks.$.subtasks': {$each: tasks.subtasks}}}
    );

    const task = await this.getTaskById(userId, taskId.toString());

    return task?.subtasks;
  }

  async updateSubtasks(
    tasks: z.infer<typeof updateSubTaskSchema>,
    userId: string,
    taskId: string
  ) {
    for (const subtask of tasks.subtasks) {
      await User.updateOne(
        {
          _id: userId,
          'tasks._id': taskId,
          'tasks.subtasks._id': subtask._id,
        },
        {
          $set: {
            'tasks.$.subtasks.$[subtask].status': subtask.status,
            'tasks.$.subtasks.$[subtask].subject': subtask.subject,
            'tasks.$.subtasks.$[subtask].deadline': subtask.deadline,
          },
        },
        {
          arrayFilters: [{'subtask._id': subtask._id}],
        }
      );
    }

    const updatedTask = await this.getTaskById(userId, taskId);

    return updatedTask?.subtasks;
  }

  async deleteSubTaskById(userId: string, taskId: string, subTaskId: string) {
    await User.updateOne(
      {
        _id: userId,
        'tasks._id': taskId,
        'tasks.subtasks._id': subTaskId,
      },
      {
        $set: {
          'tasks.$.subtasks.$[subtask].isDeleted': true,
        },
      },
      {
        arrayFilters: [{'subtask._id': subTaskId}],
      }
    );
  }
}

export default TaskService;
