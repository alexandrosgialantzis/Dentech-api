import { IOrder } from '../types/interfaces';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request';
import { checkDate } from '../helpers/check-date';

export const checkTakenDate =
  (isUpdating = false) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { takenDate } = req.body as IOrder;

    if (!takenDate && !isUpdating) {
      throw new BadRequestError('Πρέπει να δώσετε ημ/νια παραλάβης!');
    }

    if (isUpdating && !takenDate) {
      return next();
    }

    await checkDate(takenDate, 'παραλαβής');
    next();
  };

export const checkSendDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sendDate } = req.body as IOrder;

  if (!sendDate) {
    return next();
  }

  await checkDate(sendDate, 'αποστολής');
  next();
};
