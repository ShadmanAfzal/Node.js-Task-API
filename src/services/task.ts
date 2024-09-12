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
  /**
   * Creates a new task for a specified user and adds it to the user's task list.
   *
   * @param taskBody - The details of the task to be created, validated against `createTaskSchema`.
   * @param userId - The ID of the user for whom the task is being created.
   * @returns A promise that returns the newly created task.
   */
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

  /**
   * Retrieves all non-deleted tasks and their subtasks for a specified user.
   *
   * @param userId - The ID of the user whose tasks are to be retrieved.
   * @returns A promise that returns an array of tasks belonging to the user, including non-deleted subtasks.
   */
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

    return user.at(0).tasks;
  }

  /**
   * Retrieves a specific non-deleted task by its ID for a given user, including its non-deleted subtasks.
   *
   * @param userId - The ID of the user to whom the task belongs.
   * @param taskId - The ID of the task to be retrieved.
   * @returns A promise that returns the task object if found, including its subtasks, or `undefined` if the task is not found or is deleted.
   */
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

    return user?.at(0)?.tasks?.at(0);
  }

  /**
   * Updates the specified task for a given user with new details.
   *
   * @param task - The updated task details, validated against `createTaskSchema`.
   * @param taskId - The ID of the task to be updated.
   * @param userId - The ID of the user to whom the task belongs.
   * @returns A promise that returns the updated task object if the update is successful, or `null` if the task is not found.
   */
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

  /**
   * Marks a specific task as deleted for a given user by setting the `isDeleted` field to `true`.
   *
   * @param userId - The ID of the user to whom the task belongs.
   * @param taskId - The ID of the task to be marked as deleted.
   * @returns A promise that returns when the task is successfully marked as deleted.
   */
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

  /**
   * Retrieves all subtasks for a specific task of a given user.
   *
   * @param userId - The ID of the user to whom the task belongs.
   * @param taskId - The ID of the task whose subtasks are to be retrieved.
   * @returns A promise that returns an array of subtasks for the specified task, or `undefined` if the task is not found.
   */
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

  /**
   * Updates the subtasks of a specific task for a given user with new details.
   *
   * @param tasks - An object containing an array of subtasks to be updated, validated against `updateSubTaskSchema`.
   * @param userId - The ID of the user to whom the task belongs.
   * @param taskId - The ID of the task whose subtasks are to be updated.
   * @returns A promise that returns all the updated subtasks.
   */
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

  /**
   * Marks a specific subtask as deleted by setting the `isDeleted` flag to `true`.
   *
   * @param userId - The ID of the user to whom the task belongs.
   * @param taskId - The ID of the task that contains the subtask.
   * @param subTaskId - The ID of the subtask to be marked as deleted.
   * @returns A promise that returns once the subtask is successfully marked as deleted.
   */
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
