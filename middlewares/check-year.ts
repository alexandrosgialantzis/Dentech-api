import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request';

export const checkYear = (req: Request, res: Response, next: NextFunction) => {
  const year = Number(req.body.year);

  if (!Number.isSafeInteger(year)) {
    throw new BadRequestError('Η χρονία πρέπει να είναι αριθμός');
  }

  if (year < 2020 || year > 2060) {
    throw new BadRequestError('Η χρονία πρέπει να είναι μεταξύ 2020 - 2060');
  }

  next();
};
