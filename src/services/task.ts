import {z} from 'zod';

import UserService from './user';
import {createTaskSchema} from '../utils/validation-schema/task';
import User from '../db';
import mongoose from 'mongoose';

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
    const user = await User.findById(userId);

    return user?.tasks.filter(task => !task.isDeleted);
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

    return user?.tasks?.at(0);
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
}

export default TaskService;
