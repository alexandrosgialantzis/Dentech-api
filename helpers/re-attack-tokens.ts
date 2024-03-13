import { Response } from 'express';
import { attachTokens } from './jwt';
import { createTokenUser } from './create-token-user';
import User from '../models/User';

export const reattachTokens = async (res: Response, id: string) => {
  const updatedUser = await User.findById(id);

  if (updatedUser) {
    const tokenUser = createTokenUser(updatedUser);
    attachTokens(res, tokenUser);
  }
};
