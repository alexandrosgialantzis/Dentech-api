import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { NotFoundError } from '../errors/not-found';

export const isEntityExists =
  <T>(model: Model<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const entity = await model.findById(id);
    if (!entity) {
      throw new NotFoundError('Δεν βρέθηκε η οντότητα!');
    }

    next();
  };
