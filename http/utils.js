'use strict';

const Response = require('./Response').Response;

/**
 *
 * @param {function} handler
 * @returns {function({}, {}, function(Error, {}))}
 */
const apiGatewayHandlerWrapper = function(handler) {
  return (event, context, callback) => {
    let promise;

    try {
      promise = handler(event, context);
    } catch(e) {
      callback(e);
    }

    if(!(promise instanceof Promise)) {
      let handled_value = promise;
      promise = new Promise((resolve, reject) => {
        resolve(handled_value);
      });
    }

    promise
      .then((resp) => {
        if(resp instanceof Response) {
          callback(null, resp.toApiGatewayResponse());
        } else {
          callback(null, resp);
        }
      })
      .catch((err) => {
        callback(err ? err : 'An unknown error occurred.');
      });
  };
};

const checkStatus = function(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error
  }
};

const parseJSON = function(response) {
  return response.json()
};

module.exports.apiGatewayHandlerWrapper = apiGatewayHandlerWrapper;
module.exports.checkStatus = checkStatus;
module.exports.parseJSON = parseJSON;