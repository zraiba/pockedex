const FunTranslatorApi = require("../apiClients/funTranslationApiClient.js");
const PokeApi = require("../apiClients/pokeApiClient.js");
const { filterPokemonFields } = require("../utils/utils.js");

const PokedexController = {
	getPokemonInformation: async (req, res) => {
		const { pokemonName } = req.params;

		if (!pokemonName) {
			return res
				.status(400)
				.json({ error: "Pokemon name parameter is required" });
		}

		try {
			const pokeInfo = await PokeApi.getPokemonInformation(
				`pokemon-species/${pokemonName}`
			);
			const pokemonData = filterPokemonFields(pokeInfo);

			res.json(pokemonData);
		} catch (error) {
			console.error(`Error fetching Pokemon information: ${error.message}`);
			res.status(500).json({ error: "Failed to fetch Pokemon information" });
		}
	},

	getTranslatedPokemonDescription: async (req, res) => {
		const { pokemonName } = req.params;

		if (!pokemonName) {
			return res
				.status(400)
				.json({ error: "Pokemon name parameter is required" });
		}

		try {
			const pokeInfo = await PokeApi.getPokemonInformation(
				`pokemon-species/${pokemonName}`
			);
			const pokemonData = filterPokemonFields(pokeInfo);

			if (pokemonData.description) {
				let translatedDescription = pokemonData.description;
				let translationType =
					pokemonData.isLegendary || pokemonData.habitat == "cave"
						? "yoda.json"
						: "shakespeare.json";

				translatedDescription = FunTranslatorApi.getFunTranslation(
					translationType,
					pokemonData.description
				)
					.then(() => {
						pokemonData.description = translatedDescription;
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
			console.error(
				`Error fetching or translating Pokemon description: ${error.message}`
			);
			res
				.status(500)
				.json({ error: "Failed to fetch or translate Pokemon description" });
		}
	},
};

module.exports = { PokedexController };
