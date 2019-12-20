import { ModuleResponse } from '@interfaces';
import { ControllerMethod } from '@classes';

import quotes from '@resources/quotes.json';

class Index extends ControllerMethod {
  public handle = async (): Promise<ModuleResponse> =>
    this.getQuote().then(this.respond);

  private async getQuote(): Promise<void> {
    this.data = quotes[Math.floor(Math.random() * 5420)];
  }
}

export const index = new Index();
