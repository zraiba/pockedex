function filterPokemonFields(data) {
	const {
		name,
		flavor_text_entries: flavorTextEntries,
		habitat,
		is_legendary: isLegendary,
	} = data;

	const description =
		flavorTextEntries?.find((entry) => entry.language.name === "en")
			?.flavor_text || null;

	return {
		name,
		description,
		habitat: habitat?.name || null,
		isLegendary,
	};
}

module.exports = { filterPokemonFields };
