import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';

import config from '@config';

import middlewares from '@middlewares/index';
import ExceptionHandler from '@middlewares/ExceptionHandler.middleware';
import Response404 from '@middlewares/Response404.middleware';

import translate from '@services/translate.service';

import routes from './routes';

class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
    Sentry.init(config.services.sentry);

    this.middlewares();
    this.database();
    this.routes();

    this.express.use(Response404);
    this.express.use(ExceptionHandler);
  }

  public boot(): express.Application {
    // console.clear();
    console.log(`App starting at ${config.app.url}:${config.app.port}`);
    return this.express;
  }

  private middlewares(): void {
    // The request handler must be the first middleware on the app
    this.express.use(Sentry.Handlers.requestHandler());

    // default: using 'accept-language' header to guess language settings
    this.express.use(translate.init);

    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.json());
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(...middlewares);
  }

  private database(): void {
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useFindAndModify', false);
    mongoose
      .connect(config.app.database.connectionString)
      .then((): void => {
        console.log('Connected to db');
      })
      .catch((error): void => {
        console.log('Error during database connection');
        console.log(error.message);
      });
  }

  private routes(): void {
    this.express.use(routes);

    // The error handler must be before any other error middleware and after all controllers
    this.express.use(Sentry.Handlers.errorHandler());
  }
}

export default App;
