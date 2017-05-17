'use strict';

const Response = require('../http/Response').Response;

class SpeechResponse extends Response {
  constructor(text_to_speak, text_to_display, extra) {
    super(Object.assign({
      speech: text_to_speak,
      displayText: text_to_display ? text_to_display : text_to_speak,
    }, typeof extra === 'object' ? extra : {}), 200);
  }
}

module.exports = {SpeechResponse};