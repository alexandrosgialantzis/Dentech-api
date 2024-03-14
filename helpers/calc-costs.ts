import mongoose from 'mongoose';
import { BadRequestError } from '../errors/bad-request';
import { ICalcCosts } from '../types/interfaces';
import Product from '../models/Product';

export const calcCosts = async (
  paid: number,
  products: mongoose.Types.ObjectId[] | string[]
): Promise<ICalcCosts> => {
  let totalCost = 0;
  let unPaid = 0;

  for (const prod of products) {
    const product = await Product.findOne({ _id: prod });
    totalCost += product?.price!;
  }

  if (paid > totalCost) {
    throw new BadRequestError(
      'Το συνολικό κόστος είναι μικρότερο απο το πληρωμένο ποσό!'
    );
  }

  if (paid) {
    unPaid = totalCost - paid;
  } else {
    unPaid = totalCost;
  }

  return { totalCost, unPaid };
};
