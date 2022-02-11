import { getItemDescription } from "../../specific/specific";
import {Properties} from "../types";
import { comparePropertyType, PropertyType, valueToPropertyType } from "./PropertyType";

class ItemProperties {
    properties: Properties = {}

    setProperty(name: string, value: any) {
        if (valueToPropertyType(value) === PropertyType.INVALID) {
            throw new Error("Trying to set property '" + name + "' to an invalid propertyType.\nValue: " + value);
        }

        this.properties[name] = value;
    }

    getProperty(name: string) {
        return this.properties[name];
    }

    isValidItem(): boolean {
        let description = getItemDescription();
        for (let prop in description) {
            if (!description[prop].optional && !comparePropertyType(valueToPropertyType(this.properties[prop]), description[prop].valueType))
                return false;
        }
        return true;
    }
}

export default ItemProperties