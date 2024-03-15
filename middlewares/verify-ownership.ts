import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/unauthorized';

export const verifyAccountOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { userId } = req.currentUser;

  if (id !== userId.toString()) {
    throw new UnauthorizedError('Απαγορεύεται η πρόσβαση, προσπαθήστε πάλι!');
  }

  next();
};
