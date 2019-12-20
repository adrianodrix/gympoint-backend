import ModuleRegisterService from '@services/ModuleRegister.service';
import * as Controller from './Home.controller';
import Endpoints from './Home.endpoints';

const homeModule = new ModuleRegisterService(Endpoints, Controller);

homeModule.registerEndpoints();

export default homeModule.getRoutes();
