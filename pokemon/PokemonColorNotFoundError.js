class PokemonColorNotFoundError extends Error {
  constructor(color) {
    super(`Could not find color: ${color}`);
    this.color = color;
  }
}

module.exports = exports = PokemonColorNotFoundError;