import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth';

export class AuthController {
  private serv: AuthService;
  constructor() {
    this.serv = new AuthService();
  }

  public async register(req: Request, res: Response) {
    const { body } = req;
    const result = await this.serv.register(body);

    res.status(StatusCodes.CREATED).json({
      user: result.user,
      token: result.token,
      message: 'Συνδεθήκατε!',
    });
  }

  public async login(req: Request, res: Response) {
    const { body } = req;
    const result = await this.serv.login(body);
    res.status(StatusCodes.OK).json({
      user: result.user,
      token: result.token,
      message: 'Συνδεθήκατε!',
    });
  }

  logout(req: Request, res: Response) {
    res.status(StatusCodes.OK).json({ message: 'Αποσυνδεθήκατε!' });
  }
}
