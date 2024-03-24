import express from 'express';
import { isEntityExists } from '../middlewares/is-entity-exists';
import User from '../models/User';
import { UserController } from '../controllers/user';
import { authorizePermissions } from '../middlewares/auth';
import { Roles } from '../types/enums';
import { verifyAccountOwnership } from '../middlewares/verify-ownership';
import { hasRoleProperty } from '../middlewares/has-role';

const userController = new UserController();
const router = express.Router();

router.post(
  '/create-user',
  authorizePermissions(Roles.ADMIN),
  userController.createUser.bind(userController)
);
router.get(
  '/get-current-user',
  userController.getCurrentUser.bind(userController)
);
router.get(
  '/get-users',
  authorizePermissions(Roles.ADMIN),
  userController.getUsers.bind(userController)
);
router.get(
  '/:id/get-single-user',
  authorizePermissions(Roles.ADMIN),
  isEntityExists(User),
  userController.getSingleUser.bind(userController)
);
router.delete(
  '/:id/delete-user',
  verifyAccountOwnership,
  isEntityExists(User),
  userController.deleteUser.bind(userController)
);
router.patch(
  '/:id/update-user',
  hasRoleProperty,
  verifyAccountOwnership,
  isEntityExists(User),
  userController.updateUser.bind(userController)
);
router.patch(
  '/:id/change-password',
  verifyAccountOwnership,
  isEntityExists(User),
  userController.changePassword.bind(userController)
);
router.patch(
  '/:id/change-role',
  authorizePermissions(Roles.ADMIN),
  isEntityExists(User),
  userController.changeUserRole.bind(userController)
);
router.get(
  '/get-admins',
  authorizePermissions(Roles.UNCATEGORIZED),
  userController.getAdmins.bind(userController)
);

export default router;
