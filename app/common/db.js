'use strict';

const Sequelize = require('sequelize');

let connection_url;
if(process.env.POKEDEX_EXPLORER_DATABASE_URL)
  connection_url = process.env.POKEDEX_EXPLORER_DATABASE_URL;
else if(process.env.CLEARDB_DATABASE_URL)
  connection_url = CLEARDB_DATABASE_URL;
else
  connection_url = 'mysql://pokedexexplorer:pokedexexplorer@localhost/pokedex';

console.log('Using mysql database at: ' + connection_url);

exports = module.exports = new Sequelize(connection_url);