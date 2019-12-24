import { Request, Response } from 'express';

import { ModuleResponse } from '@interfaces';
import { ControllerMethod } from '@classes';

import UserModel from '../models/User.schema';
import { User } from '../interfaces/User.interface';

class Index extends ControllerMethod {
  private users: User[];

  public handle = async (
    req: Request,
    res: Response
  ): Promise<ModuleResponse> => {
    this.setParams(req, res);
    return this.getUsers().then(this.respond);
  };

  private async getUsers(): Promise<void> {
    const { page = 1, q } = this.req.query;
    let query = {};
    const options = {
      page,
      limit: 20,
      sort: { name: 1 },
    };

    if (typeof q !== 'undefined' && q !== null && q !== '') {
      query = {
        $or: [
          { email: { $regex: `.*${q}.*`, $options: 'i' } },
          { name: { $regex: `.*${q}.*`, $options: 'i' } },
        ],
      };
    }

    this.users = await UserModel.paginate(query, options);

    this.data = this.users;
  }
}

export const index = new Index();
