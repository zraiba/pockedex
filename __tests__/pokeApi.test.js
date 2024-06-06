const axios = require('axios');
const PokeApi = require('../apiClients/pokeApiClient');

jest.mock('axios');

describe('PokeApi', () => {
  describe('getPokemonInformation', () => {
    it('should return data when API call is successful', async () => {
      const mockData = { name: 'bulbasaur', id: 1 };

      axios.get.mockResolvedValueOnce({ data: mockData });

      const result = await PokeApi.getPokemonInformation('/pokemon-species/bulbasaur');

      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith('/pokemon-species/bulbasaur');
    });

    it('should throw an error when API call fails', async () => {
      const mockError = new Error('Network error');

      axios.get.mockRejectedValueOnce(mockError);

      await expect(PokeApi.getPokemonInformation('/pokemon-species/bulbasaur')).rejects.toThrow('Network error');
      expect(axios.get).toHaveBeenCalledWith('/pokemon-species/bulbasaur');
    });
  });
});