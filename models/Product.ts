import mongoose, { Schema, Types } from 'mongoose';
import { IProduct } from '../interfaces_enums/interfaces';
import './Order';

const productSchema = new Schema<IProduct>(
  {
    price: {
      type: Number,
      required: [true, 'Παρακαλώ δώστε τιμή προιοντός.'],
    },
    name: {
      type: String,
      required: [true, 'Παρακαλώ δώστε όνομα προιόντος.'],
      minlength: 3,
      maxlength: 35,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Παρακαλώ δώστε δημιουργό προιόντος.'],
    },
    orders: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
