import {
  IsString,
  Length,
  validateOrReject,
  IsDate,
  IsFQDN,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

import { ModuleResponse } from '@interfaces';
import { ControllerMethod } from '@classes';

import UserModel from '../models/User.schema';
import { User, Address } from '../interfaces/User.interface';

class InputValidation {
  @IsString()
  @Length(3, 255)
  @ValidateIf(o => !o)
  public name: string;

  @Length(9, 11)
  @ValidateIf(o => !o)
  public phone: string;

  @Length(0, 350)
  @IsFQDN()
  @ValidateIf(o => !o)
  public avatar: string;

  @IsDate()
  @ValidateIf(o => !o)
  public birthdate: Date;

  @ValidateNested()
  @ValidateIf(o => !o)
  public address: Address;
}

interface SanitizedProps {
  name?: string;
  phone?: string;
  birthdate?: Date;
  address?: Address;
}

class UpdateMe extends ControllerMethod {
  private userId: string;
  private newProps: User;
  private user: User;
  private sanitizedProps: SanitizedProps;

  public handle = async (
    req: Request,
    res: Response,
    newProps: User
  ): Promise<ModuleResponse> => {
    this.setParams(req, res);
    this.newProps = newProps;

    return this.validateInput()
      .then(this.checkIfUserExists)
      .then(this.sanitizeProps)
      .then(this.updateUserProps)
      .then(this.respond);
  };

  private validateInput = async (): Promise<void> => {
    try {
      const validation = new InputValidation();

      validation.name = this.newProps.name;
      validation.phone = this.newProps.phone;
      validation.address = this.newProps.address;
      validation.avatar = this.newProps.avatar;
      validation.birthdate = this.newProps.birthdate;

      await validateOrReject(validation);
    } catch (error) {
      throw new this.HttpException(
        HttpStatus.NOT_ACCEPTABLE,
        this.req.__('validation.invalidInputs'),
        error
      );
    }
  };

  private checkIfUserExists = async (): Promise<void> => {
    const authenticatedUser = <User>this.req.user;

    const user: User = await UserModel.findOne({
      _id: authenticatedUser.id,
    }).catch(
      (): User => {
        throw new this.HttpException(
          HttpStatus.NOT_ACCEPTABLE,
          this.req.__('user.notExists')
        );
      }
    );

    this.user = user;
  };

  private sanitizeProps = (): void => {
    // const sanitized = { ...this.user };
    const sanitized = { ...this.newProps };

    // Sensitive data
    delete sanitized.email;
    delete sanitized.active;
    delete sanitized.password;
    delete sanitized.passwordReset;
    delete sanitized.lastLogin;
    delete sanitized.createdAt;
    delete sanitized.updatedAt;

    this.sanitizedProps = sanitized;
  };

  private updateUserProps = async (): Promise<void> => {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: this.user.id },
      { $set: { ...this.sanitizedProps } },
      { new: true }
    );

    this.data = { ...this.sanitizedProps };
  };
}

export const updateMe = new UpdateMe();
