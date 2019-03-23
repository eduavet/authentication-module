const Joi = require('joi');

const Auth = require('../handlers/auth');
const joiReusables = require('../utils/joiReusables');

const routes = [];

routes.push({
  method: 'GET',
  path: '/user',
  config: {
    handler: Auth.user,
    validate: {
      query: {
        token: Joi.string().required(),
      },
    },
    response: joiReusables.user,
  },
});

routes.push({
  method: 'POST',
  path: '/login',
  config: {
    validate: {
      payload: {
        username: Joi.string().required(),
        password: Joi.string().required(),
      },
      failAction: joiReusables.failAction,
    },
    response: joiReusables.token,
    handler: Auth.login,
  },
});

routes.push({
  method: 'POST',
  path: '/register',
  config: {
    validate: {
      payload: Joi.object({
        username: Joi.string().required(),
        password: joiReusables.password,
      }),
      failAction: joiReusables.failAction,
    },
    response: joiReusables.token,
    handler: Auth.register,
  },
});

module.exports = routes;
