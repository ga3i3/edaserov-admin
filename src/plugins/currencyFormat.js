export default (total) => {
	const total_format = new Intl.NumberFormat("ru-RU", {
		style: "currency",
		currency: "RUB",
	}).format(total);
	return total_format;
}