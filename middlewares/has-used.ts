import { NextFunction, Request, Response } from 'express';
import { ICredit, IOrder } from '../types/interfaces';
import Credit from '../models/Credit';
import { NotFoundError } from '../errors/not-found';
import { BadRequestError } from '../errors/bad-request';

export const hasUsed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isUsed } = req.body as ICredit;

  if (isUsed) {
    throw new BadRequestError(
      'Δεν μπορείτε να διαμορφώσετε την κατάσταση της πίστωσης!'
    );
  }

  next();
};
