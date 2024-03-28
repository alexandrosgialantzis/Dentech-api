import jwt from 'jsonwebtoken';
import { InternalServerError } from '../errors/internal-server-error';
import { Response } from 'express';
import { IUser, IUserWithId } from '../types/interfaces';

const { sign, verify } = jwt;

export const createToken = (payload: IUserWithId | IUser) => {
  if (process.env.JWT_SECRET) {
    const token = sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });
    return token;
  } else {
    throw new InternalServerError('Το Jason Web Token λείπει!');
  }
};

export const isValidToken = (token: string) =>
  verify(token, process.env.JWT_SECRET!);

export const attachTokens = (res: Response, user: IUserWithId | IUser) => {
  const token = createToken(user);

  const sixMonths = 1000 * 60 * 60 * 24 * 183; //6 months

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + sixMonths),
    secure: true,
    sameSite: process.env.NODE_PROD ? 'none' : 'lax',
    signed: true,
  });

  return token;
};
