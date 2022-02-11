export enum PropertyType {
    STRING,
    INTEGER,
    FLOAT,
    STRING_LIST,
    LIST,
    INVALID
}

export function comparePropertyType(val1: PropertyType, val2: PropertyType): boolean {
    if (val1 === PropertyType.LIST) {
        return [PropertyType.STRING_LIST].includes(val2);
    }
    else if (val2 === PropertyType.LIST) {
        return [PropertyType.STRING_LIST].includes(val1);
    }
    else {
        return val1 === val2;
    }
}

export function valueToPropertyType(value: any): PropertyType {
    if (typeof value === "string") {
        return PropertyType.STRING;
    } 
    else if (typeof value === "number") {
        if (value.toString().includes(".")) {
            return PropertyType.FLOAT;
        }
        else {
            return PropertyType.INTEGER;
        }
    }
    else if (Array.isArray(value)) {
        if (value.length == 0) {
            return PropertyType.LIST
        }
        else if (typeof value[0] === "string") {
            return PropertyType.STRING_LIST
        }
    }

    return PropertyType.INVALID;
}