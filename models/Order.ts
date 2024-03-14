import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../types/interfaces';

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
    numberOfOrder: { type: String, unique: true },
    products: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
      required: [true, 'Προσθέστε προιόντα.'],
    },
  },
  { timestamps: true, versionKey: false }
);

orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastOrder = await Order.findOne().sort({ numberOfOrder: -1 });
    this.numberOfOrder = lastOrder?.numberOfOrder
      ? (Number(lastOrder.numberOfOrder) + 1).toString()
      : '1';
  }
  next();
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
