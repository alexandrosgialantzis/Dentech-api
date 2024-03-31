import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

export const notFoundMiddleware = (req: Request, res: Response) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: 'Δεν βρέθηκε η διαδρομή!' });
};
