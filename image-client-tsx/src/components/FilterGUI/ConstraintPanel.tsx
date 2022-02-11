import { Box, Card, InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";
import Constraint from "../../elements/objects/Constraint";
import styles from "./FilterDialog.module.css";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { ConstraintType, NumberConstraintType } from "../../elements/ConstraintType";
import { getPossibleConstraintTypes } from "../../elements/objects/constraints/ConstraintFactory";
import { getItemDescription } from "../../specific/specific";

abstract class ConstraintPanel extends React.Component<{propertyName: string, constraint: Constraint, deleteConstraint: (constraint: Constraint) => void}, {error: boolean}> {
    
    state = {
        error: false
    }

    abstract getInputFields() : JSX.Element;

    render() {
        return (
            <Card className={styles.constraint}>
                <Box display="flex" className={styles.constraintList}>
                    <Select
                    id="type-select"
                    value={this.props.constraint.type}
                    onChange={(event: React.ChangeEvent<{name?: string | undefined; value: unknown;}>) => {
                        this.props.constraint.type = event.target.value as ConstraintType;
                        this.forceUpdate();
                    }}
                    >
                        {
                            getPossibleConstraintTypes(getItemDescription()[this.props.propertyName].valueType)?.map(type => <MenuItem value={type}>{type}</MenuItem>)
                        }
                    </Select>
                    <DeleteForeverIcon 
                        color={"secondary"} cursor="pointer" onClick={() => {
                            this.props.deleteConstraint(this.props.constraint);
                        }}
                    />
                </Box>
                <hr />
                {
                    this.getInputFields()
                }
            </Card>
        )
    }
}

export default ConstraintPanel