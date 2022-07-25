export function convertToMySqlDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const mySqlDate = year + "-" + month + "-" + day;
    return mySqlDate;
}

export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return month + day + year;
}
