const knex = require('knex');
const config = require('../knexfile.js');

const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];

const db = knex(environmentConfig);

module.exports = db;