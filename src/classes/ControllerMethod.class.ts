import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

import { ModuleResponse } from '@interfaces';
import { HttpException } from '@classes';
import AuthenticationService from '@services/Authentication.service';

class Method {
  public status: number;
  public data: object | [];
  public HttpException: any;
  public Auth: AuthenticationService;
  public req: Request;
  public res: Response;

  public constructor() {
    this.status = HttpStatus.OK;
    this.data = {};
    this.HttpException = HttpException;
    this.Auth = new AuthenticationService();
  }

  public setParams(req: Request, res: Response) {
    this.req = req;
    this.res = res;
  }

  public respond = (): ModuleResponse => {
    return {
      status: this.status,
      data: this.data,
    };
  };
}

export { Method as ControllerMethod };
export default Method;
