import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors/not-found';
import User from '../models/User';
import { Roles } from '../types/enums';
import { BadRequestError } from '../errors/bad-request';

export const checkDentist =
  (isUpdating = false) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dentist = req.query.dentist || req.body.dentist;

    if (!dentist && isUpdating) {
      return next();
    } else if (!dentist && !isUpdating) {
      throw new BadRequestError('Προσθέστε οδοντίατρο!');
    }

    const user = await User.findOne({ _id: dentist });

    if (!user) {
      throw new NotFoundError('Δεν βρέθηκε ο οδοντίατρος!');
    }
    if (user.role !== Roles.DENTIST) {
      throw new NotFoundError('Ο χρήστης δεν είναι οδοντίατρος!');
    }

    next();
  };
