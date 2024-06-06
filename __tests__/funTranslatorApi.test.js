// __tests__/FunTranslatorApi.test.js

jest.mock("axios");
const axios = require("axios");
const FunTranslatorApi = require("../apiClients/funTranslationApiClient.js");

describe("FunTranslatorApi", () => {
	describe("getFunTranslation", () => {
		it("should return translated text when API call is successful", async () => {
			const text = "Hello world";
			const mockTranslation = "Force be with you world";
			const mockResponse = {
				data: {
					success: { total: 1 },
					contents: { translated: mockTranslation, text: text },
				},
			};

			axios.post.mockResolvedValue(mockResponse);

			const result = await FunTranslatorApi.getFunTranslation(
				"yoda.json",
				text
			);
			expect(result).toBe(mockTranslation);
		});

		it("should throw an error when API call is unsuccessful", async () => {
			const mockResponse = {
				data: {
					success: { total: 0 },
				},
			};

			axios.post.mockResolvedValue(mockResponse);

			await expect(
				FunTranslatorApi.getFunTranslation("yoda.json", "Hello world")
			).rejects.toThrow("Error during translation");
		});

		it("should throw an error when API call fails", async () => {
			const mockError = new Error("Network error");

			axios.post.mockRejectedValue(mockError);

			await expect(
				FunTranslatorApi.getFunTranslation("yoda.json", "Hello world")
			).rejects.toThrow("Network error");
		});
	});
});
