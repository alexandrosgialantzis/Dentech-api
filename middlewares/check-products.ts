import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors/not-found';
import { BadRequestError } from '../errors/bad-request';
import { IOrder, IOrderPayload } from '../interfaces_enums/interfaces';
import Product from '../models/Product';

export const checkProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const payload: IOrderPayload = body;

  if (!payload.add?.length && payload.remove?.length) {
    return next();
  }

  const addSet = new Set();
  const removeSet = new Set();

  if (payload.add) {
    for (const prod of payload.add) {
      addSet.add(prod);

      const product = await Product.findOne({ _id: prod });
      if (!product) {
        throw new NotFoundError('Το προιόν δεν βρέθηκε!');
      }
    }
  }

  if (payload.remove) {
    for (const prod of payload.remove ?? []) {
      removeSet.add(prod);

      const product = await Product.findOne({ _id: prod });
      if (!product) {
        throw new NotFoundError('Το προιόν δεν βρέθηκε!');
      }
    }
  }

  if (removeSet.size !== payload.remove?.length) {
    throw new BadRequestError('Υπάρχουν διπλότυπα προιόντα στην παραγγελία!');
  }

  if (addSet.size !== payload.add?.length) {
    throw new BadRequestError('Υπάρχουν διπλότυπα προιόντα στην παραγγελία!');
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

  if (unique.size !== products.length) {
    throw new BadRequestError('Υπάρχουν διπλότυπα προιόντα στην παραγγελία!');
  }

  next();
};
