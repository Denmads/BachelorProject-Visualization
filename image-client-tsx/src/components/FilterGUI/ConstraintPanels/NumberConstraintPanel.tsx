import { TextField } from '@material-ui/core';
import React from 'react';
import NumberConstraint from '../../../elements/objects/constraints/NumberConstraint';
import { valueToPropertyType } from '../../../elements/objects/PropertyType';
import ConstraintPanel from '../ConstraintPanel';

class NumberConstraintPanel extends ConstraintPanel {

    numberConstraint: NumberConstraint = this.props.constraint as NumberConstraint;

    getInputFields(): JSX.Element {
        return (
            <TextField 
                id="outlined-basic" 
                label="Value" 
                defaultValue={this.numberConstraint.value} 
                error={this.state.error}
                onChange={(event) => {
                    let num = Number(event.target.value);
                    if (isNaN(num)) {
                        this.setState({error: true});
                        return;
                    }
                    else {
                        this.setState({error: false});
                        this.numberConstraint.value = num;
                    }  
                }}
            />
        )
    }

}

export default NumberConstraintPanel