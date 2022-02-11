import React from "react";
import Constraint from "../../../elements/objects/Constraint";
import ConstraintFactory from "../../../elements/objects/constraints/ConstraintFactory";
import { PropertyType } from "../../../elements/objects/PropertyType";
import NumberConstraintPanel from "./NumberConstraintPanel";
import StringConstraintPanel from "./StringConstraintPanel";
import StringListConstraintPanel from "./StringListConstraintPanel";

class ConstraintPanelFactory {
    static create(type: PropertyType, name: string, constraint: Constraint, deleteFunc: (constraint: Constraint) => void) : JSX.Element | null {
        switch (type) {
            case PropertyType.FLOAT:
            case PropertyType.INTEGER:
                return (<NumberConstraintPanel propertyName={name} constraint={constraint} deleteConstraint={deleteFunc}></NumberConstraintPanel>);
            case PropertyType.STRING:
                return (<StringConstraintPanel propertyName={name} constraint={constraint} deleteConstraint={deleteFunc}></StringConstraintPanel>);
            case PropertyType.STRING_LIST:
                return (<StringListConstraintPanel propertyName={name} constraint={constraint} deleteConstraint={deleteFunc}></StringListConstraintPanel>);
            default:
                return null;
        }
    }
}

export default ConstraintPanelFactory