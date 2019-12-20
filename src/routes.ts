import { Router } from 'express';
import HomeModule from './modules/Home';
import UsersModule from './modules/Users';

const routes = Router();

routes.use('/', HomeModule);
routes.use('/users', UsersModule);

export default routes;
