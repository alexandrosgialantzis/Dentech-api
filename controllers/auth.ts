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
    const user = await this.serv.register(body);
    req.session.user = user;

    res
      .status(StatusCodes.CREATED)
      .json({ user, message: 'Η εγγραφή ολοκληρώθηκε!' });
  }

  public async login(req: Request, res: Response) {
    const { body } = req;
    const user = await this.serv.login(body);
    req.session.user = user;
    res.status(StatusCodes.OK).json({ user, message: 'Συνδεθήκατε!' });
  }

  logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Κάτι πήγε στραβά με την αποσύνδεση' });
      }

      res.status(StatusCodes.OK).json({ message: 'Αποσυνδεθήκατε!' });
    });
  }
}
