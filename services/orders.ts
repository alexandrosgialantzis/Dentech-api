import mongoose from 'mongoose';
import {
  IOrder,
  IOrderPayload,
  IPopulate,
  IProduct,
  IUserWithId,
} from '../types/interfaces';
import Order from '../models/Order';
import Product from '../models/Product';
import { DataLayerService } from './general-services/data-layer';
import { populateOrders } from './populate/polulate';
import { calcCosts } from '../helpers/calc-costs';
import { BadRequestError } from '../errors/bad-request';
import { OrderStatus, Roles } from '../types/enums';
import { createStatusSearchQuery } from '../helpers/create-search-with-status';
import { ForbiddenError } from '../errors/forbidden';

export class OrderService extends DataLayerService<IOrder> {
  private select: string;
  private populateOpt: IPopulate[];
  private searchFields: string[];

  constructor() {
    super(Order);
    this.select = '-createdAt';
    this.populateOpt = populateOrders;
    this.searchFields = ['numberOfOrder', 'description', 'status', 'client'];
  }

  public async getOrders(search: OrderStatus | string) {
    const searchQuery = createStatusSearchQuery(search, this.searchFields);

    return await Order.find({
      ...searchQuery,
    })
      .select(this.select)
      .populate(this.populateOpt);
  }

  public async getOrderByDentistId(dentistId: string, search: string) {
    const query = { dentist: dentistId };
    const searchQuery = createStatusSearchQuery(
      search as string | OrderStatus,
      this.searchFields
    );

    return await Order.find({ ...query, ...searchQuery })
      .populate(this.populateOpt)
      .select(this.select);
  }

  public async getSingleOrder(orderId: string, user: IUserWithId) {
    const { role, userId } = user;

    const order = await this.getOne(orderId, this.select, this.populateOpt);

    const { dentist } = order;
    if (role === Roles.DENTIST) {
      if (dentist._id.toString() !== userId.toString()) {
        throw new ForbiddenError(
          'Δεν επιτρέπεται να δείτε άλλων οδοντιάτρων παραγγελίες!'
        );
      }
    }

    return order;
  }

  public async deleteOrder(orderId: string) {
    const order = await this.delete(orderId);

    const { _id, products } = order;
    if (products.length) {
      for (const prod of products) {
        const product = (await Product.findOne({ _id: prod.id })) as IProduct;
        product.orders = product.orders.filter(
          (ord) => ord.toString() !== _id.toString()
        );
        await product.save();
      }
    }

    return order;
  }

  async updateOrder(payload: IOrderPayload, orderId: string) {
    const { paid } = payload;

    const order = await this.getOne(orderId);

    let minus = 0;
    let total = order.totalCost;
    let unpaid: null | number = null;
    let products = order.products.map((prd) => prd);

    const removeIds = payload.remove?.map((id) => id);

    if (removeIds?.length) {
      const remove = await Product.find({
        _id: { $in: removeIds },
      });

      for (const prod of remove) {
        const index = products.findIndex(
          (prd) => prd.id.toString() === prod._id.toString()
        );

        if (index !== -1) {
          minus += prod?.price * products[index].amount;
        } else {
          throw new BadRequestError(
            'To προιόν δεν ανήνει σε αυτή τη παραγγελία!'
          );
        }
      }

      for (const prd of removeIds ?? []) {
        const idStr = prd.toString();
        products = products.filter((prud) => prud.id !== idStr);
      }

      total -= minus;
      unpaid = total - paid;
    }

    if (payload.add?.length) {
      const costs = await calcCosts(paid, payload.add);
      products = payload.add;
      total = costs.totalCost;
      unpaid = costs.unPaid;
    }

    if (paid && !payload.add && !payload.add) {
      unpaid = order.totalCost - paid;
    }
    if (!products.length) {
      throw new BadRequestError('Προσθέστε προιόντα!');
    }
    if (paid > total) {
      throw new BadRequestError(
        'To εξοφλημένο ποσο ειναι μεγαλύτερο απο το συνολίκο!'
      );
    }

    if (removeIds?.length) {
      const products = await Product.find({
        _id: { $in: removeIds },
      });

      for (const prod of products) {
        prod.orders = prod.orders.filter((id) => id.toString() !== orderId);
        await prod.save();
      }
    }

    if (payload.add?.length) {
      const products = await Product.find({
        _id: { $in: payload.add?.map((prod) => prod.id) },
      });
      for (const prod of products) {
        const orders = prod.orders.map((id) => id.toString());
        if (!orders.includes(orderId)) {
          prod.orders.push(new mongoose.Types.ObjectId(orderId));
          await prod.save();
        }
      }
    }

    const data = {
      takenDate: payload.takenDate,
      sendDate: payload.sendDate,
      unPaid: unpaid ?? order.unPaid,
      totalCost: total,
      paid,
      dentist: payload.dentist,
      description: payload.description,
      products,
      status: payload.sendDate ? OrderStatus.SEND : OrderStatus.NOT_SEND,
      client: payload.client,
    } as IOrder;

    const updateOrder = await this.update(
      orderId,
      data,
      this.select,
      this.populateOpt
    );

    return updateOrder;
  }

  public async createOrder(payload: IOrder, creator: IUserWithId) {
    await super.validateData(payload);

    const { products, paid } = payload;

    const costs = await calcCosts(paid, products);
    const { totalCost, unPaid } = costs;

    const order = await super.create({
      ...payload,
      totalCost,
      status: payload.sendDate ? OrderStatus.SEND : OrderStatus.NOT_SEND,
      unPaid,
      createdBy: creator.userId,
    });

    const { _id } = order;

    for (const prod of products) {
      const product = await Product.findOne({ _id: prod.id });
      product?.orders.push(_id);
      await product?.save();
    }

    return await this.getOne(_id, this.select, this.populateOpt);
  }
}
