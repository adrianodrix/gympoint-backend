import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { validateOrReject, IsEmail, IsString, Length } from 'class-validator';

import TokenService from '@services/Token.service';
import Queue from '@services/Queue.service';

import { ModuleResponse } from '@interfaces';
import { ControllerMethod } from '@classes';
import { User, Address } from '../interfaces/User.interface';
import UserModel from '../models/User.schema';
import UserWelcomeMail from '@modules/Users/jobs/mail/UserWelcomeMail.job';

class InputValidation {
  @Length(3, 255)
  @IsString()
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  @Length(6, 40)
  public password: string;

  public phone: string;

  public address: Address;

  public avatar: string;
}

class Method extends ControllerMethod {
  private validation: InputValidation;
  private user: User;

  public constructor() {
    super();
    this.validation = new InputValidation();
  }

  public handle = async (
    req: Request,
    res: Response,
    user: User
  ): Promise<ModuleResponse> => {
    this.setParams(req, res);
    this.user = user;

    return this.validateInput()
      .then(this.verifyIfUserExists)
      .then(this.storeUser)
      .then(this.respond);
  };

  private validateInput = async (): Promise<void> => {
    this.validation.name = this.user.name;
    this.validation.email = this.user.email;
    this.validation.password = this.user.password;
    this.validation.phone = this.user.phone;
    this.validation.address = this.user.address;
    this.validation.avatar = this.user.avatar;

    await validateOrReject(this.validation).catch((errors): void => {
      throw new this.HttpException(
        HttpStatus.NOT_ACCEPTABLE,
        this.req.__('validaton.inputValidationError'),
        errors
      );
    });
  };

  private verifyIfUserExists = async (): Promise<void> => {
    return UserModel.findOne({ email: this.user.email }).then((user): void => {
      if (user) {
        throw new this.HttpException(
          HttpStatus.NOT_ACCEPTABLE,
          this.req.__('user.alreadyExists')
        );
      }
    });
  };

  private storeUser = async (): Promise<void> => {
    const storedUser = await new UserModel(this.user).save();
    const token = TokenService.encode(storedUser);

    Queue.add(UserWelcomeMail.key, { user: storedUser });

    this.status = HttpStatus.CREATED;
    this.data = {
      user: storedUser,
      meta: {
        token,
      },
    };
  };
}

export const create = new Method();
