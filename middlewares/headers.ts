import { Request, Response, NextFunction } from 'express';

export const headersMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header('Access-Control-Allow-Origin', req.header('Origin'));

  next();
};
