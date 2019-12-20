import AuthenticationMiddleware from '@middlewares/Authentication.middleware';

export default [
  {
    route: '/',
    method: 'post',
    description: 'post a new user',
    '@controller': {
      method: 'create',
      params: ['body.user'],
    },
  },
  {
    route: '/login',
    method: 'post',
    description: 'login user in',
    '@controller': {
      method: 'login',
      params: ['body.credentials'],
    },
  },
  {
    route: '/:userId',
    method: 'put',
    description: 'update user props',
    '@middlewares': [AuthenticationMiddleware],
    '@controller': {
      method: 'updateInfo',
      params: ['params.userId', 'body.props'],
    },
  },
];
