import { Request, Response } from 'express';

import { ModuleResponse } from '@interfaces';
import { ControllerMethod } from '@classes';

import quotes from '@resources/quotes.json';

class Index extends ControllerMethod {
  public handle = async (
    req: Request,
    res: Response
  ): Promise<ModuleResponse> => {
    this.setParams(req, res);

    return this.getQuote().then(this.respond);
  };

  private async getQuote(): Promise<void> {
    this.data = quotes[Math.floor(Math.random() * 5420)];
  }
}

export const index = new Index();
