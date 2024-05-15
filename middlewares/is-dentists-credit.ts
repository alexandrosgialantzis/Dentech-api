import { NextFunction, Request, Response } from 'express';
import { IOrderPayload } from '../types/interfaces';
import Credit from '../models/Credit';
import { BadRequestError } from '../errors/bad-request';

export const isDentistsCredit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { dentist, credits } = req.body as IOrderPayload;

  if (credits) {
    for (const cred of credits) {
      const credit = await Credit.findById(cred);
      if (credit?.dentist !== dentist) {
        throw new BadRequestError('Η πίστωση δεν ανήκει στον οδοντίατρο!');
      }
    }
  }

  next();
};
