const RANDOM_AFFIRMATIVE_PREFIXES = [
  'Sure thing!',
  'Absolutely!',
  'No problem!',
  'Here you go!',
  'Definitely!'
];

const getRandomAffirmativePrefix = function() {
  return RANDOM_AFFIRMATIVE_PREFIXES[Math.floor(Math.random() * RANDOM_AFFIRMATIVE_PREFIXES.length)];
};

module.exports = exports = {
  getRandomAffirmativePrefix
};