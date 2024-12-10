export const getDateDiffInDays = (prevDateInMilliSeconds: number) => {
    const currentDate = new Date();
    const differenceInMillis = currentDate.getTime() - prevDateInMilliSeconds;
    const differenceInDays = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));
    
    return differenceInDays
}
    