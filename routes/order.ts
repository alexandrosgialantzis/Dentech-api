import { OrderController } from './../controllers/order';
import express from 'express';
import { isEntityExists } from '../middlewares/is-entity-exists';
import { authorizePermissions } from '../middlewares/auth';
import { Roles } from '../types/enums';
import Order from '../models/Order';
import { hasCreatedBy } from '../middlewares/has-created-by';
import {
  checkProducts,
  checkProductsOnCreate,
} from '../middlewares/check-products';
import { checkCosts } from '../middlewares/check-costs';
import { checkDentist } from '../middlewares/is-dentist-exists';
import { checkSendDate, checkTakenDate } from '../middlewares/check-dates';

const orderController = new OrderController();
const router = express.Router();

router.post(
  '/create-order',
  authorizePermissions(Roles.ADMIN),
  checkSendDate,
  checkTakenDate(false),
  checkDentist(false),
  checkCosts,
  hasCreatedBy,
  checkProductsOnCreate,
  orderController.createOrder.bind(orderController)
);
router.get(
  '/get-orders',
  authorizePermissions(Roles.ADMIN),
  orderController.getOrders.bind(orderController)
);
router.get(
  '/:id/get-single-order',
  authorizePermissions(Roles.ADMIN, Roles.DENTIST),
  isEntityExists(Order),
  orderController.getSingleOrder.bind(orderController)
);
router.delete(
  '/:id/delete-order',
  authorizePermissions(Roles.ADMIN),
  isEntityExists(Order),
  orderController.deleteOrder.bind(orderController)
);
router.patch(
  '/:id/update-order',
  authorizePermissions(Roles.ADMIN),
  checkSendDate,
  checkTakenDate(true),
  checkDentist(true),
  checkCosts,
  hasCreatedBy,
  checkProducts,
  isEntityExists(Order),
  orderController.updateOrder.bind(orderController)
);
router.get(
  '/get-my-orders',
  authorizePermissions(Roles.DENTIST),
  orderController.getMyOrders.bind(orderController)
);
router.get(
  '/get-orders-per-dentist',
  checkDentist(false),
  authorizePermissions(Roles.ADMIN),
  orderController.getOrderByDentistId.bind(orderController)
);

export default router;
