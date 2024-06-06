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

			expect(res.status).toBe(400);
			expect(res.body.error).toBe("Pokemon name parameter is required");
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
		it("should return 400 if pokemonName is not provided", async () => {
			const res = await request(app).get("/pokemon//translated");

			expect(res.status).toBe(400);
			expect(res.body.error).toBe("Pokemon name parameter is required");
		});

		it("should return translated pokemon description", async () => {
			const mockPokemonData = {
				name: "pikachu",
				description:
					"When several of\nthese POKéMON\ngather, their\felectricity could\nbuild and cause\nlightning storms.",
				habitat: "forest",
				isLegendary: false,
			};
			PokeApi.getPokemonInformation.mockResolvedValue(mockPokemonData);
			filterPokemonFields.mockReturnValue(mockPokemonData);
			FunTranslatorApi.getFunTranslation.mockResolvedValue(
				"translated description"
			);

			const res = await request(app).get("/pokemon/pikachu/translated");

			expect(res.status).toBe(200);
			expect(res.body.description).toBe("translated description");
		});

		it("should handle translation API rate limit error", async () => {
			const mockPokemonData = {
				name: "pikachu",
				description: "electric mouse",
				isLegendary: true,
			};
			PokeApi.getPokemonInformation.mockResolvedValue(mockPokemonData);
			filterPokemonFields.mockReturnValue(mockPokemonData);
			FunTranslatorApi.getFunTranslation.mockRejectedValue({
				response: { status: 429 },
			});

			const res = await request(app).get("/pokemon/pikachu/translated");

			expect(res.status).toBe(200);
			expect(res.body.description).toBe("electric mouse");
		});

		it("should handle other errors", async () => {
			PokeApi.getPokemonInformation.mockRejectedValue(new Error("API error"));

			const res = await request(app).get("/pokemon/pikachu/translated");

			expect(res.status).toBe(500);
			expect(res.body.error).toBe(
				"Failed to fetch or translate Pokemon description"
			);
		});
	});
});
