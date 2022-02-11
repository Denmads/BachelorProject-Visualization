import { PropertyType } from "../PropertyType";
import NumberConstraint from "../constraints/NumberConstraint";
import StringConstraint from "../constraints/StringConstraint";
import StringListConstraint from "../constraints/StringListConstraint";
import { numberConstraintTypes, stringConstraintTypes, stringListConstraintTypes } from "../../ConstraintType";

class ConstraintFactory {
    static create(type: PropertyType) {
        switch (type) {
            case PropertyType.FLOAT:
            case PropertyType.INTEGER:
                return new NumberConstraint();
            case PropertyType.STRING:
                return new StringConstraint();
            case PropertyType.STRING_LIST:
                return new StringListConstraint();
            default:
                return null;
        }
    }
}

export function getPossibleConstraintTypes(type: PropertyType) {
    switch (type) {
        case PropertyType.FLOAT:
        case PropertyType.INTEGER:
            return numberConstraintTypes;
        case PropertyType.STRING:
            return stringConstraintTypes;
        case PropertyType.STRING_LIST:
            return stringListConstraintTypes;
    }
}

export default ConstraintFactory