import { UnauthorizedError } from '../errors/unauthorized';
import { createSessionUser } from '../helpers/create-token-user';
import { IUser, IUserWithToken } from '../types/interfaces';
import { DataLayerService } from './general-services/data-layer';
import User from '../models/User';
import { Roles } from '../types/enums';

export class AuthService extends DataLayerService<IUser> {
  constructor() {
    super(User);
  }

  public async register(payload: IUser): Promise<IUserWithToken> {
    await super.validateData(payload);

    const isFirstAccount = (await User.countDocuments({})) === 0;
    payload.role = isFirstAccount ? Roles.ADMIN : Roles.UNCATEGORIZED;

    const user = await super.create(payload);

    return {
      user: createSessionUser(user),
      token: user.createJWT(),
    };
  }

  public async login(payload: IUser): Promise<IUserWithToken> {
    const { email, password } = payload;

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError('Το e-mail η ο κωδίκος είναι λάθος!');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Το e-mail η ο κωδίκος είναι λάθος!');
    }

    return {
      user: createSessionUser(user),
      token: user.createJWT(),
    };
  }
}
