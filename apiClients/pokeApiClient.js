const axios = require("axios");

const pokeApiClient = axios.create({
	baseURL: "https://pokeapi.co/api/v2",
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
});

class PokeApi {
	static async getPokemonInformation(endpoint) {
		try {
			const response = await pokeApiClient.get(endpoint);
			return response.data;
		} catch (error) {
			console.error(`Error fetching data from ${endpoint}:`, error);
			throw error;
		}
	}
}

module.exports = PokeApi;
