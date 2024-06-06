const FunTranslatorApi = require("../apiClients/funTranslationApiClient.js");
const PokeApi = require("../apiClients/pokeApiClient.js");
const { filterPokemonFields } = require("../utils/utils.js");

const PokedexController = {
	getPokemonInformation: async (req, res) => {
		const { pokemonName } = req.params;

		try {
			const pokeInfo = await PokeApi.getPokemonInformation(
				`pokemon-species/${pokemonName}`
			);
			const pokemonData = filterPokemonFields(pokeInfo);

			res.json(pokemonData);
		} catch (error) {
			console.error(`Error fetching Pokemon information: ${error.status}`);
			res.status(500).json({ error: "Failed to fetch Pokemon information" });
		}
	},

	getTranslatedPokemonDescription: async (req, res) => {
		const { pokemonName } = req.params;

		try {
			const pokeInfo = await PokeApi.getPokemonInformation(
				`pokemon-species/${pokemonName}`
			);
			const pokemonData = filterPokemonFields(pokeInfo);

			if (pokemonData.description) {
				let translationType =
					pokemonData.isLegendary || pokemonData.habitat == "cave"
						? "yoda.json"
						: "shakespeare.json";

				FunTranslatorApi.getFunTranslation(
					translationType,
					pokemonData.description
				)
					.then((translated) => {
						pokemonData.description = translated;
					})
					.catch((translationError) => {
						if (
							translationError.response &&
							translationError.response.status === 429
						) {
							console.warn(
								"Translation API rate limit exceeded. Using standard description."
							);
						} else {
							throw translationError;
						}
					});
			}

			res.json(pokemonData);
		} catch (error) {
			if (error.response && error.response.status === 404) {
				res.status(404).json({ error: "Pokemon not found" });
			} else {
				console.error(
					`Error fetching or translating Pokemon description: ${error.message}`
				);
				res.status(500).json({ error: "Failed to fetch or translate Pokemon description" });
			}
		}
	},
};

module.exports = { PokedexController };
