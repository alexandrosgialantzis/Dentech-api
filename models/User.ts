import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Roles } from '../types/enums';
import { IUser, IUserWithId } from '../types/interfaces';
import {
  validateCellPhone,
  validateTelephone,
  validateEmail,
} from '../helpers/model-validators';
import jwt from 'jsonwebtoken';
import { InternalServerError } from '../errors/internal-server-error';

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Παρακαλώ δώστε ονοματεπώνυμο.'],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Παρακαλώ δώστε e-mail.'],
      minlength: 7,
      maxlength: 35,
      validate: [validateEmail, 'Παρακαλώ δώστε ένα έγκυρο e-mail.'],
    },
    password: {
      type: String,
      required: [true, 'Παρακαλώ δώστε κώδικο πρόσβασης.'],
      minlength: 5,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(Roles),
        message: "Η τιμή '{VALUE}' δεν είναι σωστή για το πέδιο του ρόλου.",
      },
      default: Roles.UNCATEGORIZED,
    },
    cellPhone: {
      type: Number,
      sparse: true,
      validate: [
        validateCellPhone,
        "Λάθος μορφή κινητού τηλεφώνου, πρέπει να έχει 10 ψηφία και να ξεκίναει με '69'.",
      ],
    },
    telephone: {
      type: Number,
      sparse: true,
      validate: [
        validateTelephone,
        'Λάθος μορφή σταθερού τηλεφώνου, πρέπει να έχει 10 ψηφία.',
      ],
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt: string = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createJWT = function (): string {
  if (!process.env.JTW_SECRET) {
    throw new InternalServerError('Κάτι πήγε στραβά!');
  }
  const user = {
    userId: this._id,
    fullName: this.fullName,
    telephone: this.telephone,
    cellPhone: this.cellPhone,
    role: this.role,
    email: this.email,
  } as IUserWithId;

  const lifeTime = {
    expiresIn: process.env.JWT_LIFETIME,
  };

  return jwt.sign(user, process.env.JTW_SECRET, lifeTime);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
