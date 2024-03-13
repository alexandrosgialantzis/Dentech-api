import { IUserWithId } from '../../interfaces_enums/interfaces';

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUserWithId;
    }
  }
}
