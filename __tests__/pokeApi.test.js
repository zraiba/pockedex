// __tests__/PokeApi.test.js

const axios = require("axios");
const PokeApi = require("../apiClients/pokeApiClient.js");
const MockAdapter = require("axios-mock-adapter");
const mock = new MockAdapter(axios);

describe("PokeApi", () => {
	describe("getPokemonInformation", () => {
		it("should return data when API call is successful", async () => {
			const mandatoryFields = [
				"name",
				"flavor_text_entries",
				"is_legendary",
				"habitat",
			];
			const mockResponse = { data: mockData };

			mock
				.onGet("https://pokeapi.co/api/v2/pokemon-species/bulbasaur")
				.reply(200, mockResponse);

			const result = await PokeApi.getPokemonInformation(
				"pokemon-species/bulbasaur"
			);

			for (const field in mandatoryFields) {
				expect(result).toHaveProperty(field);
			}
		});

		it("should throw an error when API call fails", async () => {
			const mockError = new Error("Network error");

			axios.get.mockRejectedValue(mockError);

			await expect(
				PokeApi.getPokemonInformation("pokemon-species/bulbasaur")
			).rejects.toThrow("Network error");
		});
	});
});
