import mongoose from 'mongoose';
import { BadRequestError } from '../errors/bad-request';
import { ICalcCosts, IProductDB } from '../types/interfaces';
import Product from '../models/Product';

export const calcCosts = async (
  paid: number,
  products: IProductDB[]
): Promise<ICalcCosts> => {
  let totalCost = 0;
  let unPaid = 0;

  for (const prd of products) {
    const product = await Product.findOne({ _id: prd.id });
    totalCost += product?.price! * prd.amount;
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
