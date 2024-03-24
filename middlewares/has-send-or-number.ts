import { ConflictError } from '../errors/conflict';
import { NextFunction, Request, Response } from 'express';

export const hasNumberOrStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { numberOfOrder, status } = req.body;

  if (numberOfOrder || status) {
    throw new ConflictError(
      'Απαγορευεται να δώσετε αριθμό η κατάσταση παραγγελίας!'
    );
  }

  next();
};
