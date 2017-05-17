'use strict';

const pokemon = require('./pokemon'),
  ai = require('./ai'),
  httpUtils = require('./http/utils'),
  wrap = httpUtils.apiGatewayHandlerWrapper,
  Response = require('./http/Response').Response;



module.exports.status = wrap((event) => {
  return new Response(Object.assign({status: 'ok'}, {event}));
});

module.exports.random = wrap((event) => {
  return pokemon.resolve(event.queryStringParameters);
});

module.exports.ai = wrap((event) => {
  return ai.resolve(JSON.parse(event.body));
});