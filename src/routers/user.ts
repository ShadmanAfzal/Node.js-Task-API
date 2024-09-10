import {Router} from 'express';
import controller from '../controllers/user';
import ensureAuthentication from '../middlewares/auth';

const router = Router();

router.get('/me', ensureAuthentication, controller.getLoggedUser);

export default router;
