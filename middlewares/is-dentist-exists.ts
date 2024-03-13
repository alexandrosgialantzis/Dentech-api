import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors/not-found';
import { IOrder } from '../interfaces_enums/interfaces';
import User from '../models/User';
import { Roles } from '../interfaces_enums/enums';

export const checkDentist =
  (isUpdating = false) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dentist = req.query.dentist || req.body.dentist;

    if (!dentist && isUpdating) {
      return next();
    }

    const den = await User.findOne({ _id: dentist });
    if (!den) {
      throw new NotFoundError('Δεν βρέθηκε ο οδοντίατρος!');
    }
    if (den.role !== Roles.DENTIST) {
      throw new NotFoundError('Ο χρήστης δεν είναι οδοντίατρος!');
    }

    next();
  };
