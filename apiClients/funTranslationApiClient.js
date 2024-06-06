const axios = require("axios");

const BASE_URL = "https://api.funtranslations.com/translate/";
const TIMEOUT = 10000;

const funTranslationApiClient = axios.create({
	baseURL: BASE_URL,
	timeout: TIMEOUT,
	headers: { "Content-Type": "application/json" },
});

class FunTranslatorApi {
	static async getFunTranslation(endpoint, text) {
		if (!endpoint) {
			throw new Error("Endpoint parameter is required");
		}

		if (!text) {
			throw new Error("Text parameter is required for translation");
		}

		try {
			const response = await funTranslationApiClient.post(endpoint, { text });

			const success = response.data?.success?.total ?? 0;
			const translatedText = response.data?.contents?.translated ?? "";

			if (success > 0) {
				return translatedText;
			} else {
				throw new Error("Translation failed with no success response");
			}
		} catch (error) {
			const errorMessage = `Error fetching data from ${endpoint}: ${error.message}`;
			console.error(errorMessage, error);
			throw new Error(errorMessage);
		}
	}
}

module.exports = FunTranslatorApi;
