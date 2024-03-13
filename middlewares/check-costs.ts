import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request';
import { IOrder } from '../interfaces_enums/interfaces';

export const checkCosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { unPaid, totalCost } = req.body as IOrder;

  if (unPaid || totalCost) {
    throw new BadRequestError('Δεν μπορείται να προσθέσεται κόστοι!');
  }

  next();
};
