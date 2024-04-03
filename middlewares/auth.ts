import { ForbiddenError } from '../errors/forbidden';
import { Request, Response, NextFunction } from 'express';
import { Roles } from '../types/enums';
import { UnauthorizedError } from '../errors/unauthorized';
import jwt from 'jsonwebtoken';
import { IUserWithId } from '../types/interfaces';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Δεν βρέθηκε χρήστης');
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JTW_SECRET!) as IUserWithId;

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
    throw new UnauthorizedError('Δεν βρέθηκε χρήστης');
  }
};

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader || authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Είστε συνδεμένος!');
  }
  next();
};

export const isNotLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
