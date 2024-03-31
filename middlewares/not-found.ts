import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

export const notFoundMiddleware = (req: Request, res: Response) => {
  console.log(req.baseUrl, req.originalUrl);
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: 'Δεν βρέθηκε η διαδρομή!' });
};
