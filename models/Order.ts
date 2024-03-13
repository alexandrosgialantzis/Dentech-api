import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../interfaces_enums/interfaces';

const orderSchema = new Schema<IOrder>(
  {
    takenDate: {
      type: Date,
      required: [true, 'Παρακαλώ δώστε ημερομινία παραλαβής.'],
    },
    sendDate: {
      type: Date,
      default: null,
    },
    dentist: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Παρακαλώ προσθέστε οδοντίατρο.'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Παρακαλώ δώστε δημιουργό προιόντος.'],
    },
    totalCost: {
      type: Number,
      required: [true, 'Παρακαλώ δώστε κόστος.'],
    },
    unPaid: {
      type: Number,
      required: [true, 'Παρακαλώ δώστε μη εξοφλημένο ποσό.'],
    },
    paid: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    products: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
      required: [true, 'Προσθέστε προιόντα.'],
    },
  },
  { timestamps: true, versionKey: false }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
