import { ConflictError } from '../errors/conflict';
import { NextFunction, Request, Response } from 'express';

export const hasCreatedBy = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { createdBy } = req.body;

  if (createdBy) {
    throw new ConflictError('Απαγορευεται να δώσετε δημιουργό!');
  }

  next();
};
