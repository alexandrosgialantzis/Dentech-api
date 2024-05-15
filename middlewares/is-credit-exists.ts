import { NextFunction, Request, Response } from 'express';
import { IOrder } from '../types/interfaces';
import Credit from '../models/Credit';
import { NotFoundError } from '../errors/not-found';

export const isCreditExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { credits } = req.body as IOrder;

  if (credits) {
    for (const id in credits) {
      const credit = await Credit.findById(id);
      if (!credit) {
        throw new NotFoundError('Δεν βρέθηκε η πίστωση!');
      }
    }
  }

  next();
};
