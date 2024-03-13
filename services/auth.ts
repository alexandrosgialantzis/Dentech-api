import { UnauthorizedError } from '../errors/unauthorized';
import { createTokenUser } from '../helpers/create-token-user';
import { IUser } from '../interfaces_enums/interfaces';
import { DataLayerService } from './general-services/data-layer';
import User from '../models/User';
import { Roles } from '../interfaces_enums/enums';

export class AuthService extends DataLayerService<IUser> {
  constructor() {
    super(User);
  }

  public async register(payload: IUser) {
    await super.validateData(payload);

    const isFirstAccount = (await User.countDocuments({})) === 0;
    payload.role = isFirstAccount ? Roles.ADMIN : Roles.UNCATEGORIZED;

    const user = await super.create(payload);

    return createTokenUser(user);
  }

  public async login(payload: IUser) {
    const { email, password } = payload;

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError('Το e-mail η ο κωδίκος είναι λάθος!');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Το e-mail η ο κωδίκος είναι λάθος!');
    }

    return createTokenUser(user);
  }
}
