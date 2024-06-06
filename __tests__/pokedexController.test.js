const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

jest.mock("../apiClients/funTranslationApiClient.js");
jest.mock("../apiClients/pokeApiClient.js");
jest.mock("../utils/utils.js");

const FunTranslatorApi = require("../apiClients/funTranslationApiClient.js");
const PokeApi = require("../apiClients/pokeApiClient.js");
const { filterPokemonFields } = require("../utils/utils.js");
const { PokedexController } = require("../controllers/pokedex.js");

const app = express();
app.use(bodyParser.json());

app.get("/pokemon/:pokemonName", PokedexController.getPokemonInformation);
app.get(
	"/pokemon/translated/:pokemonName",
	PokedexController.getTranslatedPokemonDescription
);

describe("PokedexController", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("getPokemonInformation", () => {
		it("should return 404 if pokemonName is not provided", async () => {
			const res = await request(app).get("/pokemon/");

			expect(res.status).toBe(404);
		});

		it("should return pokemon information", async () => {
			const mockPokemonData = {
				name: "pikachu",
				description:
					"When several of\nthese POKéMON\ngather, their\felectricity could\nbuild and cause\nlightning storms.",
				habitat: "forest",
				isLegendary: false,
			};
			PokeApi.getPokemonInformation.mockResolvedValue(mockPokemonData);
			filterPokemonFields.mockReturnValue(mockPokemonData);

			const res = await request(app).get("/pokemon/pikachu");

			expect(res.status).toBe(200);
			expect(res.body).toEqual(mockPokemonData);
		});

		it("should handle errors", async () => {
			PokeApi.getPokemonInformation.mockRejectedValue(new Error("API error"));

			const res = await request(app).get("/pokemon/pikachu");

			expect(res.status).toBe(500);
			expect(res.body.error).toBe("Failed to fetch Pokemon information");
		});
	});

	describe("getTranslatedPokemonDescription", () => {
		it("should return translated pokemon description (Shakespear)", async () => {
			const mockPokemonData = {
				name: "pikachu",
				description:
					"When several of these pokémon gather, their electricity could build and cause lightning storms.",
				habitat: "forest",
				isLegendary: false,
			};
			PokeApi.getPokemonInformation.mockResolvedValue(mockPokemonData);
			filterPokemonFields.mockReturnValue(mockPokemonData);
			FunTranslatorApi.getFunTranslation.mockResolvedValue(
				"At which hour several of these pokémon gather, their electricity couldst buildeth and cause lightning storms"
			);

			const res = await request(app).get("/pokemon/translated/pikachu");

			expect(res.status).toBe(200);
			expect(res.body.description).toBe(
				"At which hour several of these pokémon gather, their electricity couldst buildeth and cause lightning storms"
			);
		});

		it("should return translated pokemon description (Yoda)", async () => {
			const mockPokemonData = {
				name: "mewtwo",
				description:
					"When several of these pokémon gather, their electricity could build and cause lightning storms.",
				habitat: "forest",
				isLegendary: true,
			};
			PokeApi.getPokemonInformation.mockResolvedValue(mockPokemonData);
			filterPokemonFields.mockReturnValue(mockPokemonData);
			FunTranslatorApi.getFunTranslation.mockResolvedValue(
				"When several of these pokémon gather,And cause lightning storms, their electricity could build."
			);

			const res = await request(app).get("/pokemon/translated/pikachu");

			expect(res.status).toBe(200);
			expect(res.body.description).toBe(
				"When several of these pokémon gather,And cause lightning storms, their electricity could build."
			);
		});

		it("should return 500 if description is not provided", async () => {
			const mockPokemonData = {
				name: "mewtwo",
				description: null,
				habitat: "forest",
				isLegendary: true,
			};
			PokeApi.getPokemonInformation.mockResolvedValue(mockPokemonData);
			filterPokemonFields.mockReturnValue(mockPokemonData);
			FunTranslatorApi.getFunTranslation.mockResolvedValue(
				"When several of these pokémon gather,And cause lightning storms, their electricity could build."
			);

			const res = await request(app).get("/pokemon/translated/pikachu");

			expect(res.status).toBe(500);
		});

		it("should handle translation API rate limit error", async () => {
			const mockPokemonData = {
				name: "mewtwo",
				description:
					"When several of these pokémon gather, their electricity could build and cause lightning storms.",
				habitat: "forest",
				isLegendary: true,
			};
			PokeApi.getPokemonInformation.mockResolvedValue(mockPokemonData);
			filterPokemonFields.mockReturnValue(mockPokemonData);
			FunTranslatorApi.getFunTranslation.mockRejectedValue({
				response: { status: 429 },
			});

			const res = await request(app).get("/pokemon/translated/pikachu");

			expect(res.status).toBe(200);
			expect(res.body.description).toBe(
				"When several of these pokémon gather, their electricity could build and cause lightning storms."
			);
		});

		it("should handle other errors", async () => {
			PokeApi.getPokemonInformation.mockRejectedValue(new Error("API error"));

			const res = await request(app).get("/pokemon/translated/pikachu");

			expect(res.status).toBe(500);
			expect(res.body.error).toBe(
				"Failed to fetch or translate Pokemon description"
			);
		});
	});
});
