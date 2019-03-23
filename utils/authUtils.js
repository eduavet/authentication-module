const bcrypt = require('bcrypt-nodejs');
const Promise = require('promise');

const db = require('../db');

const bcryptGenSalt = Promise.denodeify(bcrypt.genSalt);
const bcryptHash = Promise.denodeify(bcrypt.hash, 3);
const bcryptCompare = Promise.denodeify(bcrypt.compare);

const SALT_FACTOR = 5;
const tokenLife = process.env.TOKEN_LIFE_DAYS;

const Utils = {};
module.exports = Utils;

Utils.generateHash = password => bcryptGenSalt(SALT_FACTOR)
  .then(salt => bcryptHash(password, salt))
  .catch(console.error);

Utils.passwordCompare = (password, testPassword) => bcryptCompare(testPassword, password)
  .catch(console.error);

Utils.userCreate = user => db.one(`
  INSERT INTO users
    (username, password)
  VALUES
    ($<username>, $<password>)
  RETURNING
    uuid
  `, user)
  .then(res => Utils.saveToken(user.token, res.uuid))
  .catch(console.error);

Utils.saveToken = (token, owner) => db.none(`
  INSERT INTO tokens
    (token, owner, expiring_at)
  VALUES
    ($1, $2, NOW() + INTERVAL '${tokenLife}' DAY)
`, [token, owner])
  .catch(console.error);

Utils.userFindByUsername = username => db.oneOrNone(`
  SELECT
    uuid, username, password
  FROM users
  WHERE username = $1
  LIMIT 1
  `, username)
  .then(result => (result === null ? null : result))
  .catch(console.error);

Utils.usernameExists = username => db.any(`
  SELECT uuid
  FROM users
  WHERE username = $1
`, username)
  .then((rows) => {
    if (rows.length > 0) return true;
    return false;
  })
  .catch(console.error);

Utils.userFindByToken = token => db.oneOrNone(`
  SELECT users.username, tokens.expiring_at
  FROM tokens
  JOIN users
    ON tokens.owner = users.uuid
  WHERE token = $1
`, token)
  .catch(console.error);
