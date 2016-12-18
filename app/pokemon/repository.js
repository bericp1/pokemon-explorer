'use strict';

const SPECIES_MAX = 721,
  API_BASE = 'https://pokeapi.co/api/v2';

const fetch = require('node-fetch'),
  httpUtils = require('./utils'),
  checkStatus = httpUtils.checkStatus,
  parseJson = httpUtils.parseJSON;

const randomSpeciesId = () => '' + Math.ceil(Math.random() * SPECIES_MAX);

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

/**
 * @returns {Promise}
 */
const getRandomSpecies = function() {
  return doFetch(API_BASE + '/pokemon-species/' + randomSpeciesId());
};

/**
 * @param {{}} species
 * @returns {Promise}
 */
const getPokemonFromSpecies = function(species) {
  return doFetch(species.varieties[0].pokemon.url);
};

/**
 * @returns {Promise}
 */
const getRandomPokemon = function() {
  return getRandomSpecies()
    .then(getPokemonFromSpecies);
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

module.exports = {
  getRandomSpecies: getRandomSpecies,
  getRandomPokemon: getRandomPokemon,
  getPokemonFromSpecies: getPokemonFromSpecies,
  describeSpecies: describeSpecies,
};