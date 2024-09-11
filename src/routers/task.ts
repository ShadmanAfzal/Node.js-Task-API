import {Router} from 'express';
import controller from '../controllers/task';
import validator from '../middlewares/validator';
import {
  createSubTaskSchema,
  createTaskSchema,
  updateSubTaskSchema,
} from '../utils/validation-schema/task';

const router = Router();

router.get('/', controller.getTasksByUser);

router.get('/:taskId', controller.getTaskById);

router.post('/', validator(createTaskSchema), controller.createTask);

router.put('/:taskId', validator(createTaskSchema), controller.editTask);

router.delete('/:taskId', controller.deleteTask);

router.get('/:taskId/subtasks', controller.getSubTasks);

router.post(
  '/:taskId/subtasks',
  validator(createSubTaskSchema),
  controller.addSubTasks
);

router.put(
  '/:taskId/subtasks',
  validator(updateSubTaskSchema),
  controller.updateSubTasks
);

router.delete('/:taskId/subtasks/:subTaskId', controller.deleteSubTaskById);

export default router;
