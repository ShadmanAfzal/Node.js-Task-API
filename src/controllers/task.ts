import {NextFunction, Request, Response} from 'express';
import TaskService from '../services/task';
import {NotFoundError} from '../utils/error';

const taskService = new TaskService();

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.createTask(req.body, req.user.id);
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
    const tasks = await taskService.getTaskByUser(req.user.id);
    if (!tasks) throw new NotFoundError('tasks not found');
    return res.send({message: 'tasks fetched successfully', tasks});
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.taskId;
    const task = await taskService.getTaskById(req.user.id, taskId);
    if (!task) throw new NotFoundError('task not found');
    return res.send({message: 'task fetched successfully', task});
  } catch (error) {
    next(error);
  }
};

const editTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.taskId;
    const task = await taskService.getTaskById(req.user.id, taskId);
    if (!task) throw new NotFoundError('task not found');
    const updatedTask = await taskService.updateTask(
      req.body,
      taskId,
      req.user.id
    );
    return res.send({message: 'task updated successfully', task: updatedTask});
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    await taskService.deleteTask(req.user.id, taskId);
  } catch (error) {
    console.log(
      'Error occured while deleting task with id %s',
      req.params.taskId,
      error
    );
  }
  return res.send({message: 'task deleted successfully'});
};

const getSubTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.taskId;
    const subtask = await taskService.getSubTasksByTaskId(req.user.id, taskId);
    return res.send({
      message: 'subtasks fetched successfully',
      subtask: subtask ?? [],
    });
  } catch (error) {
    next(error);
  }
};

const addSubTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.taskId;
    const subtask = await taskService.addSubTasks(
      req.body,
      req.user.id,
      taskId
    );
    return res.send({
      message: 'subtasks created successfully',
      subtask: subtask ?? [],
    });
  } catch (error) {
    next(error);
  }
};

const updateSubTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = req.params.taskId;
    const subtask = await taskService.updateSubtasks(
      req.body,
      req.user.id,
      taskId
    );
    return res.send({
      message: 'subtasks created successfully',
      subtask: subtask ?? [],
    });
  } catch (error) {
    next(error);
  }
};

const deleteSubTaskById = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const subTaskId = req.params.subTaskId;
    await taskService.deleteSubTaskById(req.user.id, taskId, subTaskId);
  } catch (error) {
    console.log(
      'Error occured while deleting subtask with id %s',
      req.params.subTaskId,
      error
    );
  }
  return res.send({message: 'subtask deleted successfully'});
};

export default {
  createTask,
  getTaskById,
  editTask,
  deleteTask,
  getTasksByUser,
  getSubTasks,
  addSubTasks,
  updateSubTasks,
  deleteSubTaskById,
};
