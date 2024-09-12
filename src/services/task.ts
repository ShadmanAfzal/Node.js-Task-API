import {z} from 'zod';
import mongoose from 'mongoose';

import User from '../db';
import UserService from './user';
import {
  createSubTaskSchema,
  createTaskSchema,
  updateSubTaskSchema,
} from '../utils/validation-schema/task';

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
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          tasks: {
            $filter: {
              input: '$tasks',
              as: 'task',
              cond: {$eq: ['$$task.isDeleted', false]},
            },
          },
        },
      },
      {
        $addFields: {
          tasks: {
            $map: {
              input: '$tasks',
              as: 'task',
              in: {
                _id: '$$task._id',
                subject: '$$task.subject',
                deadline: '$$task.deadline',
                status: '$$task.status',
                subtasks: {
                  $map: {
                    input: {
                      $filter: {
                        input: '$$task.subtasks',
                        as: 'subtask',
                        cond: {$eq: ['$$subtask.isDeleted', false]}, // Filter out deleted subtasks
                      },
                    },
                    as: 'subtask',
                    in: {
                      _id: '$$subtask._id',
                      subject: '$$subtask.subject',
                      deadline: '$$subtask.deadline',
                      status: '$$subtask.status',
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    return user.at(0).tasks;
  }

  async getTaskById(userId: string, taskId: string) {
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
          tasks: {
            $elemMatch: {
              _id: new mongoose.Types.ObjectId(taskId),
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          password: 1,
          tasks: {
            $map: {
              input: {
                $filter: {
                  input: '$tasks',
                  as: 'task',
                  cond: {
                    $and: [
                      {
                        $eq: [
                          '$$task._id',
                          new mongoose.Types.ObjectId(taskId),
                        ],
                      },
                      {$eq: ['$$task.isDeleted', false]},
                    ],
                  },
                },
              },
              as: 'task',
              in: {
                _id: '$$task._id',
                subject: '$$task.subject',
                deadline: '$$task.deadline',
                status: '$$task.status',
                subtasks: {
                  $map: {
                    input: {
                      $filter: {
                        input: '$$task.subtasks',
                        as: 'subtask',
                        cond: {$eq: ['$$subtask.isDeleted', false]},
                      },
                    },
                    as: 'subtask',
                    in: {
                      _id: '$$subtask._id',
                      subject: '$$subtask.subject',
                      deadline: '$$subtask.deadline',
                      status: '$$subtask.status',
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    return user?.at(0).tasks?.at(0);
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
