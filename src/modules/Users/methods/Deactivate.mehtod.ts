import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

import { ModuleResponse } from '@interfaces';
import { ControllerMethod } from '@classes';
import UserModel from '../models/User.schema';

class Deactivate extends ControllerMethod {
  private userId: string;

  public handle = async (
    req: Request,
    res: Response,
    userId: string
  ): Promise<ModuleResponse> => {
    this.setParams(req, res);
    this.userId = userId;

    return this.verifyIfUserExists()
      .then(this.deactivateUser)
      .then(this.respond);
  };

  private verifyIfUserExists = async (): Promise<void> => {
    const { userId } = this;
    const exists = await UserModel.findOne({ _id: userId });
    if (!exists) {
      throw new this.HttpException(
        HttpStatus.NOT_ACCEPTABLE,
        this.req.__('user.notExists')
      );
    }
  };

  private deactivateUser = async (): Promise<void> => {
    const { userId } = this;

    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: { active: false } }
    );

    this.data = { message: this.req.__('user.successfullyDeactivated') };
  };
}

export const deactivate = new Deactivate();
