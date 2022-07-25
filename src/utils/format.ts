export function formatNumbersOnly(number: string) {
    return number.replace(/[^0-9]+/g, "");
}

export function formatCurrency(number: string | number) {
    const formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    const formatN = Number(number);
    if (formatN > 0) {
        return `\$${formatter.format(formatN)}`;
    } else {
        return `\(\$${formatter.format(Math.abs(formatN))}\)`;
    }
}

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatPhoneNumber(phoneNumberString: string) {
    const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
}

export function cleanPhoneNumber(phoneNumberString: string) {
    return phoneNumberString.replace(/[^\d]/g, "");
}
