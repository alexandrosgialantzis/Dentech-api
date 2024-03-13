import express, { Router } from 'express';
import { AuthController } from '../controllers/auth';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/auth';
import { hasRoleProperty } from '../middlewares/has-role';

const router: Router = express.Router();
const authController = new AuthController();

router.post(
  '/register',
  isLoggedIn,
  hasRoleProperty,
  authController.register.bind(authController)
);
router.post('/login', isLoggedIn, authController.login.bind(authController));
router.get(
  '/logout',
  isNotLoggedIn,
  authController.logout.bind(authController)
);

export default router;
