import { ConstraintType, StringListConstraintType } from '../../ConstraintType';
import Constraint from '../Constraint';

class StringListConstraint extends Constraint {

    value: string;

    constructor (type?: StringListConstraintType, value?: string) {
        let t = (type === undefined ? ConstraintType.EQUALS : type)
        super(t);
        this.value = value || "";
    }
}

export default StringListConstraint