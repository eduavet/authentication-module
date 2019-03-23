const Joi = require('joi');
const Boom = require('boom');

const joiReusables = {};
module.exports = joiReusables;

joiReusables.password = Joi.string().min(8).max(64).required()
  .description('Password');

joiReusables.failAction = async (request, h, err) => Boom.badRequest(err.details[0].message);

joiReusables.token = {
  schema: {
    token: Joi.string().required(),
  },
  failAction: joiReusables.failAction,
};

joiReusables.user = {
  schema: {
    username: Joi.string().required(),
    expiring_at: Joi.string().required(),
  },
  failAction: joiReusables.failAction,
};
