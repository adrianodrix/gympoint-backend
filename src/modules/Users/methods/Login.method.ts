import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { validateOrReject, IsString, IsEmail } from 'class-validator';

import { ModuleResponse, Credentials } from '@interfaces';
import { ControllerMethod } from '@classes';
import TokenService from '@services/Token.service';

import { User } from '../interfaces/User.interface';
import UserModel from '../models/User.schema';

class InputValidation {
  @IsString()
  public password: string;

  @IsEmail()
  public email: string;
}

class Login extends ControllerMethod {
  private user: User;
  private credentials: Credentials;

  public handle = async (
    req: Request,
    res: Response,
    credentials: Credentials
  ): Promise<ModuleResponse> => {
    this.setParams(req, res);
    this.credentials = credentials;

    return this.validateInput()
      .then(this.findUser)
      .then(this.verifyPassword)
      .then(this.verifyUserIsActive)
      .then(this.generateToken)
      .then(this.respond);
  };

  private verifyUserIsActive = (): void => {
    if (!this.user.active) {
      throw new this.HttpException(
        HttpStatus.NOT_ACCEPTABLE,
        this.req.__('user.notAuthorizedToAccess')
      );
    }
  };

  private verifyPassword = async (): Promise<void> => {
    const match = await this.Auth.comparePassword(
      this.credentials.password,
      this.user.password
    );

    if (!match) {
      throw new this.HttpException(
        HttpStatus.NOT_ACCEPTABLE,
        this.req.__('user.invalidCredentials')
      );
    }
  };

  private findUser = async (): Promise<void> => {
    const user = await UserModel.findOne({ email: this.credentials.email });

    if (!user) {
      throw new this.HttpException(
        HttpStatus.NOT_ACCEPTABLE,
        this.req.__('user.notExists')
      );
    }

    this.user = user;
  };

  private validateInput = async (): Promise<void> => {
    try {
      const validation = new InputValidation();
      validation.email = this.credentials.email;
      validation.password = this.credentials.password;
      await validateOrReject(validation);
    } catch (error) {
      throw new this.HttpException(
        HttpStatus.NOT_ACCEPTABLE,
        this.req.__('user.invalidInputs')
      );
    }
  };

  private generateToken = (): void => {
    const token = TokenService.encode(this.user);

    this.data = {
      user: this.user,
      meta: {
        token,
      },
    };
  };
}

export const login = new Login();
