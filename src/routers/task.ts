import {Router} from 'express';
import controller from '../controllers/task';
import ensureAuthentication from '../middlewares/auth';
import validator from '../middlewares/validator';
import {createTaskSchema} from '../utils/validation-schema/task';

const router = Router();

router.get('/', ensureAuthentication, controller.getTasksByUser);

router.get('/:taskId', ensureAuthentication, controller.getTaskById);

router.post(
  '/',
  ensureAuthentication,
  validator(createTaskSchema),
  controller.createTask
);

router.put(
  '/:taskId',
  ensureAuthentication,
  validator(createTaskSchema),
  controller.editTask
);

router.delete('/:taskId', ensureAuthentication, controller.deleteTask);

export default router;
