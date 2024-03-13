import { ForbiddenError } from '../errors/forbidden';
import { IUserWithId } from '../interfaces_enums/interfaces';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/bad-request';
import { Roles } from '../interfaces_enums/enums';
import { isValidToken } from '../helpers/jwt';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.signedCookies.token;

  if (!token) {
    throw new ForbiddenError('Απαγορεύται η πρόσβαση, δεν βρέθηκε χρήστης!');
  }

  try {
    const payload = isValidToken(token) as IUserWithId;

    req.currentUser = {
      userId: payload.userId,
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
      cellPhone: payload.cellPhone,
      telephone: payload.telephone,
    } as IUserWithId;

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
  const token: string = req.signedCookies.token;

  if (token) {
    throw new BadRequestError('Είστε ήδη συνδεμένος');
  }

  next();
};

export const isNotLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.signedCookies.token;

  if (!token) {
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
