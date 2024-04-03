import Credit from '../models/Credit';
import Order from '../models/Order';
import { CreditStatus } from '../types/enums';
import { ICredit, IOrder, IPopulate, IUserWithId } from '../types/interfaces';
import { DataLayerService } from './general-services/data-layer';
import { populateCredits } from './populate/polulate';

export class CreditService extends DataLayerService<ICredit> {
  private select: string;
  private populateOpt: IPopulate[];
  private searchFields: string[];

  constructor() {
    super(Credit);
    this.select = '-createdAt';
    this.populateOpt = populateCredits;
    this.searchFields = ['year', 'month', 'dentist', 'isUsed'];
  }

  public async getCredits(search: CreditStatus | string) {
    return await this.getMany(
      search,
      this.select,
      this.searchFields,
      this.populateOpt
    );
  }

  public async getSingleCredit(creditId: string) {
    await this.getOne(creditId, this.select, this.populateOpt);
  }

  public async deleteCredit(creditId: string) {
    const credit = await this.delete(creditId);

    const { _id, order } = credit;
    if (order) {
      const ord = (await Order.findOne({ _id: order })) as IOrder;
      ord.credits = ord.credits.filter(
        (ord) => ord.toString() !== _id.toString()
      );
      await ord.save();
    }

    return credit;
  }

  async updateCredit(payload: ICredit, creditId: string) {
    await this.validateData(payload);
    return await this.update(creditId, payload, this.select, this.populateOpt);
  }

  public async createCredit(payload: ICredit, creator: IUserWithId) {
    await super.validateData(payload);

    const credit = await super.create({
      ...payload,
      createdBy: creator.userId,
    });

    const { _id } = credit;

    return await this.getOne(_id, this.select, this.populateOpt);
  }
}
