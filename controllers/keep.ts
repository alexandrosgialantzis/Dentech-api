import { Request, Response } from 'express';

export const keepItAlive = (req: Request, res: Response) => {
  res.status(200).json({ keep: 'its alive' });
};
