import { Interface } from 'readline';
import { CreditStatus, OrderStatus, Roles } from './enums';
import { Document, Types } from 'mongoose';

export interface ICustomError {
  statusCode: number | string;
  msg: string;
}

export interface IErrorProperties {
  message: string;
  role: {
    kind: string;
    value: string;
  };
}

export interface IUpdatedError {
  kind: string;
  path: string;
  name: string;
  statusCode: number | string;
  message: string;
  code: string | number;
  value: string;
  keyValue: string;
  errors: IErrorProperties;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: Roles;
  cellPhone?: number;
  telephone?: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createJWT(): string;
}

export interface IUserWithToken {
  user: IUserWithId;
  token: string;
}

export interface IUserWithId extends IUser {
  userId: Types.ObjectId;
}

export interface IPopulate {
  path: string;
  select: string;
  options?: {
    limit?: number;
    strictPopulate?: boolean;
  };
  populate?: IPopulate[];
}

export interface IPasswordPayload {
  newPassword: string;
  oldPassword: string;
}

export interface IProduct extends Document {
  price: number;
  name: string;
  description: string;
  createdBy: Types.ObjectId;
  orders: Types.ObjectId[];
}

export interface IProductDB {
  id: string;
  amount: number;
}

export interface IOrder extends Document {
  takenDate: Date;
  sendDate: Date;
  dentist: Types.ObjectId;
  createdBy: Types.ObjectId;
  totalCost: number;
  unPaid: number;
  paid: number;
  description: string;
  numberOfOrder: string;
  status: OrderStatus;
  client: string;
  products: IProductDB[];
  credits: Types.ObjectId[];
}

export interface IOrderPayload extends Document {
  takenDate: Date;
  sendDate: Date;
  paid: number;
  description: string;
  dentist: Types.ObjectId;
  remove?: string[];
  add?: IProductDB[];
  client: string;
  credits: Types.ObjectId[];
}

export interface ICredit extends Document {
  year: string;
  month: string;
  amount: number;
  isUsed: CreditStatus;
  dentist: Types.ObjectId;
  createdBy: Types.ObjectId;
  order: Types.ObjectId | null;
}

export interface ICalcCosts {
  totalCost: number;
  unPaid: number;
}

export interface IOrderParams {
  year?: string;
  search?: string;
  status?: OrderStatus;
}

export interface IDateQuery {
  $or?: [
    { takenDate?: { $gte: Date; $lt: Date } },
    { sendDate?: { $gte: Date; $lt: Date } }
  ];
}
