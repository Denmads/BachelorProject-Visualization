import { ConstraintType, NumberConstraintType } from "../../ConstraintType";
import Constraint from "../Constraint";

class NumberConstraint extends Constraint {

    value: number;

    constructor(type?: NumberConstraintType, value?: number) {
        let t = (type === undefined ? ConstraintType.EQUALS : type)
        super(t);
        this.value = value || 0;
    }
}

export default NumberConstraint