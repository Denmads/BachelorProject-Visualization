import { ConstraintType } from "../ConstraintType";

abstract class Constraint {
    type: ConstraintType;

    constructor(type: ConstraintType) {
        this.type = type;
    }
}

export default Constraint