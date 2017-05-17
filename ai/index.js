'use strict';

const pokemon = require('../pokemon'),
  PokemonColorNotFoundError = require('../pokemon/PokemonColorNotFoundError'),
  PokemonTypeNotFoundError = require('../pokemon/PokemonTypeNotFoundError');

const SpeechResponse = require('./SpeechResponse').SpeechResponse;

const toSpeechResponse = function(text_to_speak, text_to_display) {
  return new SpeechResponse(text_to_speak, text_to_display);
};

const toPromisedSpeechResponse = function(text_to_speak, text_to_display) {
  return new Promise((resolve, reject) => {
    resolve(toSpeechResponse(text_to_speak, text_to_display));
  });
};

const toErrorSpeechResponse = function(err) {
  if(err instanceof PokemonColorNotFoundError)
    return toSpeechResponse(
      `I don't think there are any pokemon of the color ${err.color}.`
    );

  if(err instanceof PokemonTypeNotFoundError)
    return toSpeechResponse(
      `I don't think there are any ${err.type} type pokemon.`
    );

  return toSpeechResponse(
    'My Pokedex seems to be malfunctioning.',
    'My Pokédex seems to be malfunctioning' + (err ? (': ' + err) : '.')
  );
};

const actions = {
  random_pokemon: function(params, body) {
    return pokemon.getRandomSpecies()
      .then(pokemon.describeSpecies);
  },
  random_pokemon_of_type: function(params, body) {
    if(!params['type'])
      return Promise.resolve('What type pokemon should I find?');

    return pokemon.getRandomSpeciesByType(params['type'])
      .then(pokemon.describeSpecies);
  },
  random_pokemon_of_color: function(params, body) {
    if(!params['color'])
      return Promise.resolve('What color pokemon should I find?');

    return pokemon.getRandomSpeciesByColor(params['color'])
      .then(pokemon.describeSpecies);
    },
};

const resolve = function(body) {
  if(!body || !body.result)
    return toPromisedSpeechResponse(
      'Who are you and what are you doing here?'
    );

  if(!body.result.action)
    return toPromisedSpeechResponse(
      'I\'m not quite sure what it is you want me to do.'
    );

  const action = ('' + body.result.action).toLowerCase();
  const params = body.result.parameters ? body.result.parameters : {};

  if(actions.hasOwnProperty(action))
    return actions[action](params, body)
      .then(toSpeechResponse)
      .catch(toErrorSpeechResponse);
  else
    return toPromisedSpeechResponse(
      'I\'m not quite sure what it is you want me to do.'
    );
};

module.exports.resolve = resolve;
module.exports.toErrorSpeechResponse = toErrorSpeechResponse;
module.exports.toSpeechResponse = toSpeechResponse;