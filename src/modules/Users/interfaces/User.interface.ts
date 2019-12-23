import { Document } from 'mongoose';

export interface Address {
  country?: string;
  city?: string;
  state?: string;
}

export interface PasswordReset {
  token: string;
  expiration: string;
}

export interface AuthInfo {
  userId: String;
  nbf: Number;
  exp: Number;
}

export interface User extends Document {
  id: String;
  active: boolean;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  phone?: string;
  avatar?: string;
  birthdate?: Date;
  lastLogin?: Date;
  address?: Address;
  passwordReset?: PasswordReset;
  createdAt: Date;
  updatedAt: Date;
}
