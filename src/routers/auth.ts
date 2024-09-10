import {Router} from 'express';
import controller from '../controllers/auth';
import validator from '../middlewares/validator';
import {
  createUserSchema,
  loginUserSchema,
} from '../utils/validation-schema/user';

const router = Router();

router.post('/register', validator(createUserSchema), controller.createUser);

router.post('/login', validator(loginUserSchema), controller.loginUser);

export default router;
