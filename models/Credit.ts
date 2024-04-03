import mongoose, { Schema } from 'mongoose';
import { ICredit } from '../types/interfaces';
import { CreditStatus, Months } from '../types/enums';

const creditSchema = new Schema<ICredit>(
  {
    year: {
      type: String,
      required: [true, 'Παρακαλώ δώστε έτος.'],
    },
    month: {
      type: String,
      enum: {
        values: Object.values(Months),
        message: "Η τιμή '{VALUE}' δεν είναι σωστή για το πέδιο του μήνα.",
      },
      required: [true, 'Παρακαλώ προσθέστε μήνα.'],
    },
    isUsed: {
      type: String,
      enum: {
        values: Object.values(CreditStatus),
        message:
          "Η τιμή '{VALUE}' δεν είναι σωστή για το πέδιο της κατάστασης.",
      },
      default: CreditStatus.UNUSED,
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
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

const Credit = mongoose.model<ICredit>('Credit', creditSchema);

export default Credit;
