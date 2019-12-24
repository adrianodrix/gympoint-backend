import { Schema, model, HookNextFunction } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import gravatar from 'gravatar';
import bcrypt from 'bcrypt';

import Config from '@config';
import { User } from '../interfaces/User.interface';

export const AddressSchema = new Schema({
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
});

export const PasswordResetSchema = new Schema({
  token: String,
  expiration: String,
});

const UserSchema = new Schema(
  {
    active: {
      default: true,
      type: Boolean,
    },
    admin: {
      default: false,
      type: Boolean,
    },
    email: {
      trim: true,
      required: [true, "can't be blank"],
      type: String,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "can't be blank"],
    },
    name: {
      required: true,
      type: String,
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
    },
    birthdate: {
      type: Date,
    },
    address: {
      type: AddressSchema,
    },
    lastLogin: {
      type: Date,
    },
    passwordReset: {
      type: PasswordResetSchema,
      select: false,
    },
  },
  {
    timestamps: true,
    collation: {
      locale: Config.locale ? Config.locale.substr(0, 2).toLowerCase() : 'en',
    },
  }
);

UserSchema.pre<User>('save', async function(
  next: Function
): Promise<HookNextFunction> {
  if (this.isNew) {
    if (!this.avatar && this.email) {
      this.avatar = gravatar.url(
        this.email,
        { s: '100', r: 'g', d: 'mp' },
        true
      );
    }
  }

  if (this.password) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  return next();
});

UserSchema.set('toJSON', {
  getters: true,
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
    delete ret.password;
    delete ret.active;
    delete ret.admin;

    return ret;
  },
});

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });
UserSchema.plugin(mongoosePaginate);

export default model<User>('User', UserSchema);
