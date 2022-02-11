import Vector2 from "../objects/Vector2";
import { TickDirection } from "../interfaces/Axis";
import NumberAxis from "./NumberAxis";
import EnumAxis from "./EnumAxis";
import { PropertyType } from "../objects/PropertyType";
import ListEnumAxis from "./ListEnumAxis";

class AxisFactory {
    static create(start: Vector2, end: Vector2, tickDirection: TickDirection, property: {displayName: string, propertyName: string, propertyType: PropertyType, propertyUnit: string}) {
        switch (property.propertyType) {
            case PropertyType.FLOAT:
            case PropertyType.INTEGER:
                return new NumberAxis(start, end, tickDirection, property);
            case PropertyType.STRING:
                return new EnumAxis(start, end, tickDirection, property);
            case PropertyType.STRING_LIST:
                return new ListEnumAxis(start, end, tickDirection, property);
            default:
                return null;
        }
    }
}

export default AxisFactory