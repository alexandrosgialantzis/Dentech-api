import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services/user';
import { IUserWithId } from '../interfaces_enums/interfaces';
import { reattachTokens } from '../helpers/re-attack-tokens';
import { ForbiddenError } from '../errors/forbidden';
import User from '../models/User';

export class UserController {
  private serv: UserService;

  constructor() {
    this.serv = new UserService();
  }

  public getCurrentUser(req: Request, res: Response) {
    res.status(StatusCodes.OK).json({ user: req.currentUser });
  }

  public async updateUser(req: Request, res: Response) {
    const { body } = req;
    const { id } = req.params;
    const { currentUser } = req;

    const user = await this.serv.updateUser(body, id);
    await reattachTokens(res, (currentUser as IUserWithId).userId.toString());

    res.status(StatusCodes.OK).json({
      user,
      message: 'Ο χρήστης ενημερώθηκε!',
    });
  }

  public async createUser(req: Request, res: Response) {
    const { body } = req;

    const user = await this.serv.createUser(body);

    res
      .status(StatusCodes.OK)
      .json({ user, message: 'Ο χρήστης δημιουργήθηκε!' });
  }

  public async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const { currentUser } = req;
    const { role } = currentUser!;

    const user = await this.serv.deleteUser(id, role);

    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now() + 1000),
      secure: true,
      sameSite: 'none',
      signed: true,
    });

    res
      .status(StatusCodes.OK)
      .json({ user, message: 'Ο λογαριασμός σας διαγραφτήκε!' });
  }

  public async getUsers(req: Request, res: Response) {
    const { searchString } = req.query;
    const users = await this.serv.getUsers(
      searchString as string,
      req.currentUser?.userId.toString() as string
    );

    res.status(StatusCodes.OK).json({ users, totalCount: users.length });
  }

  public async getSingleUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this.serv.getSingleUser(id);
    res.status(StatusCodes.OK).json({ user });
  }

  public async changePassword(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;

    const message = await this.serv.changePassword(id, body);

    res.status(StatusCodes.OK).json({ message });
  }

  public async changeUserRole(req: Request, res: Response) {
    const { id } = req.params;
    const { body, currentUser } = req;
    const { role } = body;
    const { userId } = currentUser!;

    const message = await this.serv.changeUserRole(id, role, userId.toString());

    res.status(StatusCodes.OK).json({ message });
  }
}
