import {NextFunction, Request, Response} from 'express';
import TaskService from '../services/task';
import {NotFoundError} from '../utils/error';

const taskService = new TaskService();

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const task = await taskService.createTask(req.body, userId);

    return res.send({message: 'task created successfully', task});
  } catch (error) {
    next(error);
  }
};

const getTasksByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const tasks = await taskService.getTaskByUser(userId);

    if (!tasks) throw new NotFoundError('tasks not found');

    return res.send({message: 'tasks fetched successfully', tasks});
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const taskId = req.params.taskId;

    const task = await taskService.getTaskById(userId, taskId);

    if (!task) throw new NotFoundError('task not found');

    return res.send({message: 'task fetched successfully', task});
  } catch (error) {
    next(error);
  }
};

const editTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const taskId = req.params.taskId;

    const task = await taskService.getTaskById(userId, taskId);

    if (!task) throw new NotFoundError('task not found');

    const updatedTask = await taskService.updateTask(req.body, taskId, userId);

    return res.send({message: 'task updated successfully', task: updatedTask});
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const taskId = req.params.taskId;

    await taskService.deleteTask(userId, taskId);
  } catch (error) {
    console.log(
      'Error occured while deleting task with id %s',
      req.params.taskId,
      error
    );
  }
  return res.send({message: 'task deleted successfully'});
};

export default {
  createTask,
  getTaskById,
  editTask,
  deleteTask,
  getTasksByUser,
};
