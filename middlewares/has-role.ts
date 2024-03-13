import { ConflictError } from './../errors/conflict';
import { IUser } from '../interfaces_enums/interfaces';
import { NextFunction, Request, Response } from 'express';

export const hasRoleProperty = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role } = req.body as IUser;

  if (role) {
    throw new ConflictError('Απαγορευεται η διαμόρφωση για το πέδιο ρόλου!');
  }

  next();
};
