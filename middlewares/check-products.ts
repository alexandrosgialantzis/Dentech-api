import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors/not-found';
import { BadRequestError } from '../errors/bad-request';
import { IOrder, IOrderPayload } from '../types/interfaces';
import Product from '../models/Product';

export const checkProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { add, remove } = req.body as IOrderPayload;

  if (!add?.length && !remove?.length) {
    return next();
  }

  const addSet = new Set();
  const removeSet = new Set();

  if (add) {
    for (const prod of add) {
      addSet.add(prod);

      const product = await Product.findOne({ _id: prod });
      if (!product) {
        throw new NotFoundError('Το προιόν δεν βρέθηκε!');
      }
    }
  }

  if (remove) {
    for (const prod of remove ?? []) {
      removeSet.add(prod);

      const product = await Product.findOne({ _id: prod });
      if (!product) {
        throw new NotFoundError('Το προιόν δεν βρέθηκε!');
      }
    }
  }

  next();
};

export const checkProductsOnCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { products } = req.body as IOrder;

  if (!products?.length && products?.length) {
    throw new BadRequestError('Προσθέτε προιόντα!');
  }

  const unique = new Set();

  for (const prod of products) {
    unique.add(prod);

    const product = await Product.findOne({ _id: prod });
    if (!product) {
      throw new NotFoundError('Το προιόν δεν βρέθηκε!');
    }
  }

  next();
};
