import express from 'express';
import { isEntityExists } from '../middlewares/is-entity-exists';
import { ProductController } from '../controllers/product';
import Product from '../models/Product';
import { hasCreatedBy } from '../middlewares/has-created-by';
import { hasOrders } from '../middlewares/has-orders';

const productController = new ProductController();
const router = express.Router();

router.post(
  '/create-product',
  hasCreatedBy,
  hasOrders,
  productController.createProduct.bind(productController)
);
router.get(
  '/get-products',
  productController.getProducts.bind(productController)
);
router.get(
  '/:id/get-single-product',
  isEntityExists(Product),
  productController.getSingleProduct.bind(productController)
);
router.delete(
  '/:id/delete-product',
  isEntityExists(Product),
  productController.deleteProduct.bind(productController)
);
router.patch(
  '/:id/update-product',
  hasCreatedBy,
  hasOrders,
  isEntityExists(Product),
  productController.updateProduct.bind(productController)
);

export default router;
