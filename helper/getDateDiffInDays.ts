const getDateDiffInDays = ({ startDate, endDate }: { startDate: number; endDate?: number }) => {
	const latesDate = endDate ? new Date(endDate) : new Date();
	const previousDate = new Date(startDate);

	// Calculate the difference in days by comparing the date parts only
	const currentDay = new Date(latesDate.getFullYear(), latesDate.getMonth(), latesDate.getDate());
	const previousDay = new Date(previousDate.getFullYear(), previousDate.getMonth(), previousDate.getDate());

	const differenceInMillis = currentDay.getTime() - previousDay.getTime();
	const differenceInDays = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));

	return differenceInDays;
};

export default getDateDiffInDays;