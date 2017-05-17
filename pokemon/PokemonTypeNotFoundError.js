class PokemonTypeNotFoundError extends Error {
  constructor(type) {
    super(`Could not find type: ${type}`);
    this.type = type;
  }
}

module.exports = exports = PokemonTypeNotFoundError;