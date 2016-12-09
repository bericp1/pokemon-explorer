'use strict';

const request = require('request');

const generateResponse = function(data, status = 200) {
  return {
    statusCode: status,
    body: JSON.stringify(data),
  };
};

// GET /status
module.exports.status = (event, context, callback) => {
  const response = generateResponse({
    status: 'ok',
    input: event
  });

  callback(null, response);
};

// GET /random
module.exports.random = (event, context, callback) => {
  const response = generateResponse({
    status: 'not_implemented',
    input: event
  }, 501);

  callback(null, response);
};

// POST /fulfill
module.exports.fulfill = (event, context, callback) => {
  const response = generateResponse({
    status: 'not_implemented',
    input: event
  }, 501);

  callback(null, response);
};
