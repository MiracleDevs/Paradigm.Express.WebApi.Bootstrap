export function toCamelCase(o: any) {
    let newO: any, origKey: any, newKey: any, value: any;
    if (o instanceof Array) {
        return o.map(function (value) {
            if (typeof value === "object") {
                value = toCamelCase(value);
            }
            return value;
        });
    } else {
        newO = {};
        for (origKey in o) {
            if (Object.prototype.hasOwnProperty.call(o, origKey)) {
                newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
                value = o[origKey];
                if (value instanceof Array || (value !== null && value.constructor === Object)) {
                    value = toCamelCase(value);
                }
                newO[newKey] = value;
            }
        }
    }
    return newO;
}
