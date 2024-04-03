import { StatusCodes } from 'http-status-codes';
import { CreditService } from '../services/credit';
import { Request, Response } from 'express';
import { IUserWithId } from '../types/interfaces';
import { CreditStatus, OrderStatus } from '../types/enums';

export class CreditController {
  private serv: CreditService;

  constructor() {
    this.serv = new CreditService();
  }

  public async updateCredit(req: Request, res: Response) {
    const { body } = req;
    const { id } = req.params;

    const credit = await this.serv.updateCredit(body, id);

    res.status(StatusCodes.OK).json({
      credit,
      message: 'Η πίστωση ενημερώθηκε!',
    });
  }

  public async createCredit(req: Request, res: Response) {
    const { body } = req;
    const { currentUser } = req;

    const credit = await this.serv.createCredit(
      body,
      currentUser as IUserWithId
    );

    res
      .status(StatusCodes.OK)
      .json({ credit, message: 'Το πίστωση δημιουργήθηκε!' });
  }

  public async deleteCredit(req: Request, res: Response) {
    const { id } = req.params;
    const credit = await this.serv.deleteCredit(id);
    res
      .status(StatusCodes.OK)
      .json({ credit, message: 'To πίστωση διαγραφτήκε!' });
  }

  public async getCredits(req: Request, res: Response) {
    const { search } = req.query;
    const credits = await this.serv.getCredits(search as string | CreditStatus);
    res.status(StatusCodes.OK).json({ credits, totalCount: credits.length });
  }

  public async getSingleCredit(req: Request, res: Response) {
    const { id } = req.params;
    const credit = await this.serv.getSingleCredit(id);
    res.status(StatusCodes.OK).json({ credit });
  }
}
