import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../types/interfaces';
import { OrderStatus } from '../types/enums';

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
    client: { type: String },
    numberOfOrder: { type: String, unique: true },
    status: {
      type: String,
      enum: {
        values: Object.values(OrderStatus),
        message: "Η τιμή '{VALUE}' δεν είναι σωστή για το πέδιο του ρόλου.",
      },
      default: OrderStatus.SEND,
    },
    products: {
      type: [
        {
          id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
          amount: { type: Number, required: true },
        },
      ],
      required: [true, 'Προσθέστε προιόντα και ποσότητα.'],
    },
    credits: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Credit',
        },
      ],
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastOrder = await Order.find().skip(
      Math.max((await Order.countDocuments()) - 1, 0)
    );

    this.numberOfOrder = lastOrder[0]?.numberOfOrder
      ? (Number(lastOrder[0].numberOfOrder) + 1).toString()
      : '1';
  }
  next();
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
