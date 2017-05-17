'use strict';

const SPECIES_MAX = 721,
  API_BASE = 'https://pokeapi.co/api/v2';

const fetch = require('node-fetch'),
  httpUtils = require('../http/utils'),
  checkStatus = httpUtils.checkStatus,
  parseJson = httpUtils.parseJSON;

const PokemonTypeNotFoundError = require('./PokemonTypeNotFoundError'),
  PokemonColorNotFoundError = require('./PokemonColorNotFoundError');

const randomSpeciesId = () => '' + Math.ceil(Math.random() * SPECIES_MAX);

const readFromAPICache = function(endpoint) {
  const cache = require('./api.cache.json');
  endpoint = endpoint.trim()
    .toLowerCase()
    .replace(/^\/+/g, '')
    .replace(/\/+$/g, '');

  return cache.hasOwnProperty(endpoint) ? cache[endpoint] : null;
};

/**
 * @param url
 * @param opts
 * @returns {Promise}
 */
const doFetch = (url, opts) => {
  return fetch(url, opts)
    .then(checkStatus)
    .then(parseJson);
};

const doFetchFromApi = (endpoint, opts) => {
  const hit = readFromAPICache(endpoint);
  if(hit)
    return Promise.resolve(hit);
  else
    return doFetch((endpoint.indexOf('http') !== 0) ? (API_BASE + endpoint) : endpoint, opts);
};

/**
 * @returns {Promise}
 */
const getRandomSpecies = function() {
  return doFetchFromApi('/pokemon-species/' + randomSpeciesId());
};

/**
 * @param {{}} species
 * @returns {Promise}
 */
const getPokemonFromSpecies = function(species) {
  return doFetch(species.varieties[0].pokemon.url);
};

/**
 * @param {string} type_name
 * @returns {Promise}
 */
const getTypeByName = function(type_name) {
  return doFetchFromApi('/type')
    .then((response) => {
      for(let type of response.results) {
        if(type.name === type_name) {
          return type;
        }
      }
      return null;
    });
};

/**
 * @param {string} id
 * @returns {Promise}
 */
const getType = function(id) {
  return doFetchFromApi(`/type/${id}`);
};

/**
 * @param {{pokemon: object[]}} type
 * @returns {*}
 */
const pickRandomPokemonFromType = function(type) {
  return type.pokemon[Math.floor(Math.random() * type.pokemon.length)].pokemon;
};

/**
 * @returns {Promise}
 */
const getRandomPokemon = function() {
  return getRandomSpecies()
    .then((species) => species.varieties[0].pokemon.url.replace(API_BASE, ''))
    .then(doFetchFromApi);
};

/**
 * @param {string} type_name
 * @returns {Promise}
 */
const getRandomPokemonByType = function(type_name) {
  return getTypeByName(type_name)
    .then((type) => {
      if(!type)
        throw new PokemonTypeNotFoundError(type_name);
      else
        return doFetchFromApi(type.url.replace(API_BASE, ''));
    })
    .then(pickRandomPokemonFromType)
    .then((pokemon) => pokemon.url.replace(API_BASE, ''))
    .then(doFetchFromApi);
};

const getRandomSpeciesByType = function(type_name) {
  return getRandomPokemonByType(type_name)
    .then((pokemon) => doFetchFromApi(pokemon.species.url.replace(API_BASE, '')))
}

const getColorByName = function(color_name) {
  return doFetchFromApi('/pokemon-color')
    .then((response) => {
      for(let color of response.results) {
        if(color.name === color_name) {
          return color;
        }
      }
      return null;
    });
};

const pickRandomSpeciesFromColor = function(color) {
  return color.pokemon_species[Math.floor(Math.random() * color.pokemon_species.length)];
};

const getRandomSpeciesByColor = function(color_name) {
  return getColorByName(color_name)
    .then((color) => {
      if(!color)
        throw new PokemonColorNotFoundError(color_name);
      else
        return doFetchFromApi(color.url.replace(API_BASE, ''));
    })
    .then(pickRandomSpeciesFromColor)
    .then((species) => species.url.replace(API_BASE, ''))
    .then(doFetchFromApi);
};

const describeSpecies = function(species) {
  let text = 'I picked ' + species.name + '! ',
    pronoun = 'It';

  // Fix pronoun if necessary
  if(species.has_gender_differences) {
    if(parseInt(species.gender_rate) === 8)
      pronoun = 'She';
    else if(parseInt(species.gender_rate) === 0)
      pronoun = 'He';
  }
  text += pronoun + '\'s a ' + species.color.name + ' pokemon';

  // Determine generation if possible
  let generation = false;
  if(species.generation.name === 'generation-i')
    generation = 'one';
  else if(species.generation.name === 'generation-ii')
    generation = 'two';
  else if(species.generation.name === 'generation-iii')
    generation = 'three';
  else if(species.generation.name === 'generation-iv')
    generation = 'four';
  else if(species.generation.name === 'generation-v')
    generation = 'five';
  else if(species.generation.name === 'generation-vi')
    generation = 'six';

  if(generation)
    text += ' from generation ' + generation;

  text += '. ';

  // Determine difficulty to catch if possible.
  let difficulty = false;
  if(species.capture_rate) {
    if(species.capture_rate <= 35)
      difficulty = 'very hard';
    else if(species.capture_rate <= 70)
      difficulty = 'hard';
    else if(species.capture_rate >= 220)
      difficulty = 'very easy';
    else if(species.capture_rate >= 185)
      difficulty = 'easy';
  }

  // Properly concatenate generation and difficulty to catch.
  if(species.evolves_from_species && species.evolves_from_species.name) {
    text += pronoun + ' evolves from ' + species.evolves_from_species.name;
    if(difficulty)
      text += ' and is ' + difficulty + ' to catch';
    text += '.';
  } else if(difficulty) {
    text += pronoun + '\'s ' + difficulty + ' to catch.'
  }

  return text;
};

// TODO Handle errors
const resolve = function(query) {
  console.dir(query);

  if(!query)
    return getRandomSpecies();

  if(query.color)
    return getRandomSpeciesByColor(query.color);
  else if(query.type)
    return getRandomSpeciesByType(query.type);
  else
    return getRandomSpecies();
};

module.exports = {
  doFetch: doFetch,
  doFetchFromApi: doFetchFromApi,
  readFromAPICache: readFromAPICache,

  getRandomSpecies: getRandomSpecies,
  getRandomSpeciesByColor: getRandomSpeciesByColor,
  getRandomSpeciesByType: getRandomSpeciesByType,
  getPokemonFromSpecies: getPokemonFromSpecies,
  describeSpecies: describeSpecies,

  getRandomPokemon: getRandomPokemon,
  getRandomPokemonByType: getRandomPokemonByType,
  getType: getType,
  getTypeByName: getTypeByName,

  resolve: resolve
};