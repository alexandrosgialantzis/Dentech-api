import { ForbiddenError } from '../errors/forbidden';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/bad-request';
import { Roles } from '../types/enums';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user) {
    throw new ForbiddenError('Απαγορεύται η πρόσβαση, δεν βρέθηκε χρήστης!');
  }

  try {
    req.currentUser = req.session.user;
    next();
  } catch (error) {
    throw new ForbiddenError('Απαγορεύται η πρόσβαση!');
  }
};

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.user) {
    throw new BadRequestError('Είστε ήδη συνδεμένος');
  }

  next();
};

export const isNotLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user) {
    throw new BadRequestError('Δεν είστε συνδένος.');
  }

  next();
};

export const authorizePermissions =
  (...roles: Roles[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.currentUser?.role as Roles)) {
      throw new ForbiddenError('Δεν επιτρέπεται η πρόσβαση.');
    }
    next();
  };
