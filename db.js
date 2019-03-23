const pg = require('pg-promise')();

const { env } = process;

const db = pg(`postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASS}@${env.POSTGRES_HOST}/${env.POSTGRES_DB}`);

module.exports = db;
