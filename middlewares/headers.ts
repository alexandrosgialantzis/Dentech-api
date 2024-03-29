import { Request, Response, NextFunction } from 'express';

export const headersMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header('Access-Control-Allow-Origin', req.header('Origin') || '*');
  res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.set(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  );

  next();
};
