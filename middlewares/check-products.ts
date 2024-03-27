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

  if (add) {
    for (const prod of add) {
      const { id } = prod;
      const product = await Product.findOne({ _id: id });
      if (!product) {
        throw new NotFoundError('Το προιόν δεν βρέθηκε!');
      }
    }
  }

  if (remove) {
    for (const id of remove ?? []) {
      const product = await Product.findOne({ _id: id });
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

  if (!products?.length) {
    throw new BadRequestError('Προσθέτε προιόντα!');
  }

  for (const prod of products) {
    const { id } = prod;
    const product = await Product.findOne({ _id: id });
    if (!product) {
      throw new NotFoundError('Το προιόν δεν βρέθηκε!');
    }
  }

  next();
};
