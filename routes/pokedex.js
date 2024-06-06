// src/routes/pokedex.js
const { Router } = require("express");
const { PokedexController } = require("../controllers/pokedex.js");

const router = new Router();

router.get(
	"/api/v1/pokemon/:pokemonName",
	PokedexController.getPokemonInformation
);

router.get(
	"/api/v1/pokemon/translated/:pokemonName",
	PokedexController.getTranslatedPokemonDescription
);

module.exports = { router };
