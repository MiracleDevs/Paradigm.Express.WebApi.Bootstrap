export function convertToMySqlDate(date: Date): string {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var day = date.getDate().toString().padStart(2, "0");
    var mySqlDate = year + "-" + month + "-" + day;
    return mySqlDate;
}

export function formatDate(date: Date): string {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return month + day + year;
}
