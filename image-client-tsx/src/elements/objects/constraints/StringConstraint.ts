import { ConstraintType, StringConstraintType } from '../../ConstraintType';
import Constraint from '../Constraint';

class StringConstraint extends Constraint {

    value: string;

    constructor (type?: StringConstraintType, value?: string) {
        let t = (type === undefined ? ConstraintType.EQUALS : type)
        super(t);
        this.value = value || "";
    }
}

export default StringConstraint