const {
	getFunTranslation,
} = require("../apiClients/funTranslationApiClient.js");
const { getPokemonInformation } = require("../apiClients/pokeApiClient.js");
const { filterPokemonFields } = require("../utils/utils.js");

const handleErrors = (res, error, customMessage) => {
	console.log(error.response);
	if (error.response && error.response.status === 404) {
		res.status(404).json({ error: "Pokemon not found" });
	} else {
		console.error(`${customMessage}: ${error.message}`);
		res.status(500).json({ error: customMessage });
	}
};

const PokedexController = {
	getPokemonInformation: async (req, res) => {
		const { pokemonName } = req.params;

		try {
			const pokeInfo = await getPokemonInformation(
				`pokemon-species/${pokemonName}`
			);
			const pokemonData = filterPokemonFields(pokeInfo);
			res.json(pokemonData);
		} catch (error) {
			handleErrors(res, error, "Failed to fetch Pokemon information");
		}
	},

	getTranslatedPokemonDescription: async (req, res) => {
		const { pokemonName } = req.params;

		try {
			const pokeInfo = await getPokemonInformation(
				`pokemon-species/${pokemonName}`
			);
			const pokemonData = filterPokemonFields(pokeInfo);

			if (pokemonData.description) {
				const translationType =
					pokemonData.isLegendary || pokemonData.habitat === "cave"
						? "yoda.json"
						: "shakespeare.json";

				try {
					const translated = await getFunTranslation(
						translationType,
						pokemonData.description
					);
					pokemonData.description = translated;
				} catch (translationError) {
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
				}

				res.json(pokemonData);
			} else {
				throw new Error("Description is empty");
			}
		} catch (error) {
			handleErrors(
				res,
				error,
				"Failed to fetch or translate Pokemon description"
			);
		}
	},
};

module.exports = { PokedexController };
