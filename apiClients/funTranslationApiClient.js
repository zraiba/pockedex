const axios = require("axios");

const funTranslationApiClient = axios.create({
	baseURL: "https://api.funtranslations.com/translate/",
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
});

class FunTranslatorApi {
	static async getFunTranslation(endpoint, dataToTranslate) {
		try {
			const response = await funTranslationApiClient.post(endpoint, {
				text: dataToTranslate,
			});

			if (response.data.success && response.data.success.total) {
				return response.data.contents.translated;
			} else {
				throw new Error("Error during translation");
			}
		} catch (error) {
			console.error(`Error fetching data from ${endpoint}:`, error);
			throw error;
		}
	}
}

module.exports = FunTranslatorApi;
