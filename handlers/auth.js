const Boom = require('boom');
const crypto = require('crypto');

const Utils = require('../utils/authUtils');
const MESSAGE = require('../utils/message');

const Auth = {};
module.exports = Auth;

Auth.register = (req) => {
  let user;
  const { username, password } = req.payload;
  const token = crypto.randomBytes(32).toString('hex');

  return Utils.usernameExists(username)
    .then((exists) => {
      if (exists) throw Boom.conflict(MESSAGE.USERNAME_EXISTS);
      user = req.payload;
    })
    .then(() => Utils.generateHash(password))
    .then((hash) => {
      user.password = hash;
      user.token = token;
      return Utils.userCreate(user);
    })
    .then(() => ({ token }))
    .catch((e) => {
      switch (e.message || e) {
        case MESSAGE.USERNAME_EXISTS:
          return Boom.conflict(MESSAGE.USERNAME_EXISTS);
        default:
          console.error('Auth.register', e, e.stack);
          return Boom.internal();
      }
    });
};

Auth.login = (req) => {
  const { username, password } = req.payload;
  const token = crypto.randomBytes(32).toString('hex');
  let uuid;

  return Utils.userFindByUsername(username)
    .then((user) => {
      if (user === null) throw Boom.unauthorized(MESSAGE.WRONG_COMBINATION);
      ({ uuid } = user);
      return user;
    })
    .then(user => Utils.passwordCompare(user.password, password))
    .then((correct) => { if (!correct) throw Boom.unauthorized(MESSAGE.WRONG_COMBINATION); })
    .then(() => Utils.saveToken(token, uuid))
    .then(() => ({ token }))
    .catch((e) => {
      switch (e.message || e) {
        case MESSAGE.WRONG_COMBINATION:
          return Boom.unauthorized(MESSAGE.WRONG_COMBINATION);
        default:
          console.error('Auth.login', e, e.stack);
          return Boom.internal();
      }
    });
};

Auth.user = (req) => {
  const { token } = req.query;

  return Utils.userFindByToken(token)
    .then((res) => {
      if (!res) return Boom.unauthorized(MESSAGE.INVALID_TOKEN);
      if (res.expiring_at < new Date()) return Boom.unauthorized(MESSAGE.TOKEN_EXPIRED);
      return res;
    })
    .catch((e) => {
      console.error('Auth.user', e, e.stack);
      return Boom.internal();
    });
};
