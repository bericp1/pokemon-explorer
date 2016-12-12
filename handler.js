'use strict';

const pokemon = require('./pokemon'),
  ai = require('./ai'),
  httpUtils = require('./http/utils'),
  wrap = httpUtils.apiGatewayHandlerWrapper,
  Response = require('./http/Response').Response;

module.exports.status = wrap((event) => {
  return new Response({status: 'ok'}, {event});
});

module.exports.random = wrap(() => {
  return pokemon.getRandomSpecies();
});

module.exports.ai = wrap(() => {
  return pokemon.getRandomSpecies()
    .then(pokemon.describeSpecies)
    .then(ai.toSpeechResponse)
    .catch(ai.toErrorSpeechResponse);
});