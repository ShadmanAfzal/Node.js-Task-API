import {Router} from 'express';
import controller from '../controllers/user';

const router = Router();

router.get('/me', controller.getLoggedUser);

export default router;
