import { ConflictError } from '../errors/conflict';
import { NextFunction, Request, Response } from 'express';

export const hasOrders = (req: Request, res: Response, next: NextFunction) => {
  const { orders } = req.body;

  if (orders?.length) {
    throw new ConflictError('Απαγορευεται να δώσετε παραγγελίες!');
  }

  next();
};

export const hasOrder = (req: Request, res: Response, next: NextFunction) => {
  const { order } = req.body;

  if (order) {
    throw new ConflictError('Απαγορευεται να δώσετε παραγγελία!');
  }

  next();
};
