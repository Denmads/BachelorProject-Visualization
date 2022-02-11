import { TextField } from '@material-ui/core';
import React from 'react';
import StringConstraint from '../../../elements/objects/constraints/StringConstraint';
import StringListConstraint from '../../../elements/objects/constraints/StringListConstraint';
import ConstraintPanel from '../ConstraintPanel';

class StringConstraintPanel extends ConstraintPanel {

    stringConstraint: StringConstraint = this.props.constraint as StringListConstraint;

    getInputFields(): JSX.Element {
        return (
            <TextField 
                id="outlined-basic" 
                label="Value" 
                defaultValue={this.stringConstraint.value} 
                onChange={(event) => {
                    this.stringConstraint.value = event.target.value
                }}
            />
        )
    }

}

export default StringConstraintPanel