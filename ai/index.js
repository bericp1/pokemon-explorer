'use strict';

const SpeechResponse = require('./SpeechResponse').SpeechResponse;

const toSpeechResponse = function(text_to_speak, text_to_display) {
  return new SpeechResponse(text_to_speak, text_to_display);
};

const toErrorSpeechResponse = function(err) {
  return toSpeechResponse(
    'My Pokedex seems to be malfunctioning.',
    'My Pokédex seems to be malfunctioning' + (err ? (': ' + err) : '.')
  );
};

module.exports.toErrorSpeechResponse = toErrorSpeechResponse;
module.exports.toSpeechResponse = toSpeechResponse;