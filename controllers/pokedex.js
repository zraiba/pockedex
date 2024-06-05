const getFunTranslation = require("../apiClients/funTranslationApiClient.js");
const getPokemonInformation = require("../apiClients/pokeApiClient.js");
const utils = require("../utils/utils.js");

const PokedexController = {
	getPokemonInformation: async (req, res) => {
		const pokemonName = req.params.pokemonName;
		const pokeInfo = await getPokemonInformation.getPokemonInformation(
			`pokemon-species/${pokemonName}`
		);

		const pokemonData = utils.filterPokemonFields(pokeInfo);
		res.json(pokemonData);
	},

	getTransaltedPokemonDescription: (req, res) => {
		res.json({ message: "Method to be implemented" });
	},
};

module.exports = { PokedexController };
