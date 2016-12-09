'use strict';

const SPECIES_MAX = 721;

const request = require('request');

const get = (path, done) => {
  return request.get({url: `http://pokeapi.co/api/v2/${path.replace(/^\//, '')}`, json: true}, done);
};

const randomSpeciesId = () => '' + Math.ceil(Math.random() * SPECIES_MAX);

const getRandomSpecies = (done) => {
  console.log('getRandomSpecies', arguments);
  done = typeof done === 'function' ? done : () => {};

  console.log('getting random species');

  get('pokemon-species/' + randomSpeciesId(), function(err, resp, body) {
    if(err || resp.statusCode !== 200) {
      console.err('failed to get random species', err, resp);
      done(err);
    } else {
      console.log('got random species', body);
      done(null, body);
    }
  });
};

const getPokemonFromSpecies = (species, done) => {
  console.log('getPokemonFromSpecies', arguments);
  done = typeof done === 'function' ? done : () => {};

  let path = species.varieties[0].pokemon.url.split('api/v2/')[1];

  console.log('getting pokemon from species', species);
  console.log('using path', path);

  get(path, function(err, resp, body) {
    if(err || resp.statusCode !== 200) {
      console.err('failed to get pokemon', err, resp);
      done(err);
    } else {
      console.log('got pokemon from species', body);
      done(null, body);
    }
  });
};

const getRandomPokemon = (done) => {
  console.log('getRandomPokemon', arguments);
  done = typeof done === 'function' ? done : () => {};

  getRandomSpecies((err, species) => {
    if(err)
      done(err);
    else
      getPokemonFromSpecies(species, (err, pokemon) => {
        if(err)
          done(err);
        else
          done(null, pokemon, species);
      });
  });
};

module.exports = {
  getRandomSpecies: getRandomSpecies,
  getRandomPokemon: getRandomPokemon,
  getPokemonFromSpecies: getPokemonFromSpecies,
};