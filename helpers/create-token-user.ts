import { IUser, IUserWithId } from '../interfaces_enums/interfaces';

export const createTokenUser = (user: IUser) =>
  ({
    userId: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    cellPhone: user.cellPhone,
    telephone: user.telephone,
  } as IUserWithId);
