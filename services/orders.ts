import mongoose from 'mongoose';
import {
  IOrder,
  IOrderParams,
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
import { createSearchQuery } from '../helpers/create-search-query';
import { OrderStatus, Roles } from '../types/enums';
import { createStatusSearchQuery } from '../helpers/create-search-with-status';
import { ForbiddenError } from '../errors/forbidden';
import { createDateQuery } from '../helpers/create-date-query';

export class OrderService extends DataLayerService<IOrder> {
  private select: string;
  private populateOpt: IPopulate[];
  private searchFields: string[];

  constructor() {
    super(Order);
    this.select = '-createdAt';
    this.populateOpt = populateOrders;
    this.searchFields = ['numberOfOrder', 'description', 'status'];
  }

  public async getOrders(search: OrderStatus | string) {
    const searchQuery = createStatusSearchQuery(search, this.searchFields);

    return await Order.find({
      ...searchQuery,
    })
      .select(this.select)
      .populate(this.populateOpt);
  }

  public async getOrderByDentistId(dentistId: string, params?: IOrderParams) {
    const { search } = params ?? ({} as IOrderParams);

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
        const product = (await Product.findOne({ _id: prod })) as IProduct;
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
    let plus = 0;
    let total = order.totalCost;
    let unpaid = 0;
    let products = order.products.map((id) => id.toString());

    if (payload.remove?.length) {
      const remove = await Product.find({
        _id: { $in: payload.remove },
      });

      for (const prodId of payload.remove ?? []) {
        const idStr = prodId.toString();
        products = products.filter((id) => id !== idStr);
      }

      for (const prod of remove) {
        minus += prod?.price;
      }

      total -= minus;
      unpaid = total - paid;
    }

    if (payload.add?.length) {
      const add = await Product.find({
        _id: { $in: payload.add },
      });

      for (const id of payload.add ?? []) {
        const idStr = id.toString();
        if (!products.includes(idStr)) {
          products.push(idStr);
        }
      }

      for (const prod of add) {
        const orders = prod.orders.map((id) => id.toString());
        if (!orders.includes(orderId)) {
          plus += prod?.price!;
        }
      }

      total += plus;
      unpaid = total - paid;
    }

    if (paid && !payload.add?.length && !payload.remove?.length) {
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

    if (payload.remove?.length) {
      const products = await Product.find({
        _id: { $in: payload.remove },
      });

      for (const prod of products) {
        prod.orders = prod.orders.filter((id) => id.toString() !== orderId);
        await prod.save();
      }
    }

    if (payload.add?.length) {
      const products = await Product.find({
        _id: { $in: payload.add },
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
      unPaid: unpaid || order.unPaid,
      totalCost: total,
      paid,
      dentist: payload.dentist,
      description: payload.description,
      products: products.map((id) => new mongoose.Types.ObjectId(id)),
      status: payload.sendDate ? OrderStatus.SEND : OrderStatus.NOT_SEND,
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
      const product = await Product.findOne({ _id: prod });
      product?.orders.push(_id);
      await product?.save();
    }

    return await this.getOne(_id, this.select, this.populateOpt);
  }
}
