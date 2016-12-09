'use strict';

const pokemon = require('./pokemon');

class Response {
  constructor(data, status) {
    console.log('response created', arguments);
    this.data = data;
    this.status = typeof status === 'number' ? status : 200;
  }

  setStatus(status) {
    return this.status = status;
  }

  setData(data) {
    return this.data = data;
  }

  formatted() {
    return {
      statusCode: this.status,
      body: JSON.stringify(this.data)
    };
  }
}

class SpeechResponse {
  constructor(text_to_speak, text_to_display) {
    this.response = new Response({
      speech: text_to_speak,
      displayText: text_to_display ? text_to_display : text_to_speak,
    }, 200);
  }

  formatted() {
    return this.response.formatted();
  }
}

const status = (event, context, done) => {
  console.log('status');
  done(null, new Response({status: 'ok', event}));
};

const random = (event, context, done) => {
  console.log('random');
  pokemon.getRandomPokemon((err, pokemon, species) => {
    if(err)
      done(err);
    else
      done(null, new Response({pokemon, species}));
  });
};

const fulfill = (event, context, done) => {
  console.log('fulfill', event);

  let body = JSON.parse(event.body),
    action = body.result.action;

  if(action === 'random_pokemon') {
    pokemon.getRandomSpecies((err, species) => {
      let text;
      if(err)
        text = 'I\'m sorry. Something went wrong on my side of things.';
      else {
        text = 'I picked ' + species.name + '! ';
        let pronoun = 'It';
        if(species.has_gender_differences) {
          if(parseInt(species.gender_rate) === 8)
            pronoun = 'She';
          else if(parseInt(species.gender_rate) === 0)
            pronoun = 'He';
        }
        text += pronoun + '\'s a ' + species.color.name + ' pokemon';
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

        if(species.evolves_from_species && species.evolves_from_species.name) {
          text += pronoun + ' evolves from ' + species.evolves_from_species.name;
          if(difficulty)
            text += ' and is ' + difficulty + ' to catch';
          text += '.';
        } else if(difficulty) {
          text += pronoun + '\'s ' + difficulty + ' to catch.'
        }
      }

      done(null, new SpeechResponse(text));
    });
  } else {
    done(null, new SpeechResponse('Hm... I don\'t think I know how to do that.'));
  }
};

const routes = {
  '/status': {
    get: status
  },
  '/random': {
    get: random
  },
  '/fulfill': {
    post: fulfill
  }
};

module.exports.handle = (event, context, callback) => {
  console.log(event);

  const handler = (err, resp) => {
    if(err)
      callback(err);
    else
      callback(null, resp.formatted());
  };

  const method = event.httpMethod.toLowerCase();

  if(typeof routes[event.path] === 'function')
    routes[event.path](event, context, handler);
  else if(typeof routes[event.path] === 'object' && typeof routes[event.path][method] === 'function')
    routes[event.path][method](event, context, handler);
  else if(typeof routes[event.path] === 'object' && typeof routes[event.path].any === 'function')
    routes[event.path].any(event, context, handler);
  else
    handler('not_found');
};