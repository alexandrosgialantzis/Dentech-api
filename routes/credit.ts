import express from 'express';
import { isEntityExists } from '../middlewares/is-entity-exists';
import { hasCreatedBy } from '../middlewares/has-created-by';
import { hasOrder } from '../middlewares/has-orders';
import { CreditController } from '../controllers/credit';
import Credit from '../models/Credit';
import { checkDentist } from '../middlewares/is-dentist-exists';
import { checkYear } from '../middlewares/check-year';
import { hasUsed } from '../middlewares/has-used';

const creditController = new CreditController();
const router = express.Router();

router.post(
  '/create-credit',
  hasUsed,
  checkYear,
  checkDentist(false),
  hasCreatedBy,
  hasOrder,
  creditController.createCredit.bind(creditController)
);
router.get('/get-credits', creditController.getCredits.bind(creditController));
router.get(
  '/:id/get-single-credit',
  isEntityExists(Credit),
  creditController.getSingleCredit.bind(creditController)
);
router.delete(
  '/:id/delete-credit',
  isEntityExists(Credit),
  creditController.deleteCredit.bind(creditController)
);
router.patch(
  '/:id/update-credit',
  hasUsed,
  checkYear,
  checkDentist(true),
  hasCreatedBy,
  hasOrder,
  isEntityExists(Credit),
  creditController.updateCredit.bind(creditController)
);

export default router;
