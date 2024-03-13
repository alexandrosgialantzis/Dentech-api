import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth';
import { attachTokens } from '../helpers/jwt';

export class AuthController {
  private serv: AuthService;
  constructor() {
    this.serv = new AuthService();
  }

  public async register(req: Request, res: Response) {
    const { body } = req;
    const user = await this.serv.register(body);
    attachTokens(res, user);

    res
      .status(StatusCodes.CREATED)
      .json({ user, message: 'Η εγγραφή ολοκληρώθηκε!' });
  }

  public async login(req: Request, res: Response) {
    const { body } = req;
    const user = await this.serv.login(body);
    attachTokens(res, user);

    res.status(StatusCodes.OK).json({ user, message: 'Συνδεθήκατε!' });
  }

  logout(req: Request, res: Response) {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now() + 1000),
      secure: true,
      sameSite: 'none',
      signed: true,
    });

    res.status(StatusCodes.OK).json({ message: 'Αποσυνδεθήκατε!' });
  }
}
