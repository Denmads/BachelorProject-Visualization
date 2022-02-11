import { Box, Button, Card, Container, IconButton, makeStyles } from "@material-ui/core";
import React from "react";
import { getItemDescription } from "../../specific/specific";
import styles from "./FilterDialog.module.css";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Constraint from "../../elements/objects/Constraint";
import ItemPropertyStorage from "../../elements/ItemPropertyStorage";
import ConstraintFactory from "../../elements/objects/constraints/ConstraintFactory";
import ConstraintPanelFactory from "./ConstraintPanels/ConstraintPanelFactory";


class ConstraintColumn extends React.Component<{propertyName: string, deleteProperty: (property: string) => void, setConstraints: (property: string, constraints: Constraint[]) => void, constraints: Constraint[]}, {constraints: Constraint[]}> {

    constructor(props: {propertyName: string, deleteProperty: (property: string) => void, setConstraints: (property: string, constraints: Constraint[]) => void, constraints: Constraint[]}) {
        super(props);

        this.deleteConstraint = this.deleteConstraint.bind(this);

        this.state = {
            constraints: props.constraints
        }
    }

    componentDidUpdate() {
        if (JSON.stringify(this.state.constraints) !== JSON.stringify(this.props.constraints)) {
            this.setState({constraints: this.props.constraints})
        }
    }

    deleteConstraint(constraint: Constraint) {
        this.setState(state => {
            let prevCons = [...state.constraints];
            prevCons.splice(prevCons.indexOf(constraint), 1)
            return {
                constraints: prevCons
            }
        })
    }

    render() {

        return (
            <Card className={styles.column}>
                <Container>
                    <Box display="flex" flexDirection="column" className={styles.columnContainer}>
                        <h3>{getItemDescription()[this.props.propertyName].displayName}</h3>
                        <Box display="flex" flexDirection="column" className={styles.constraintList}>
                            {
                                this.state.constraints.map(con => ConstraintPanelFactory.create(getItemDescription()[this.props.propertyName].valueType, this.props.propertyName, con, this.deleteConstraint))
                            }
                        </Box>
                        <Box display="flex" className={styles.constraintList}>
                            <AddCircleIcon color={"primary"} cursor="pointer" onClick={() => {
                                this.setState(state => {
                                    let prevConstraints = [...state.constraints];
                                    let newConstraint = ConstraintFactory.create(getItemDescription()[this.props.propertyName].valueType);
                                    prevConstraints.push(newConstraint as Constraint);
                                    this.props.setConstraints(this.props.propertyName, prevConstraints);
                                    return {constraints: prevConstraints}
                                })
                            }}/>
                            <DeleteForeverIcon 
                                color={"secondary"} cursor="pointer" onClick={() => {
                                    for (let con of this.state.constraints) {
                                        this.deleteConstraint(con)
                                    }

                                    this.props.deleteProperty(this.props.propertyName);
                                }}
                            />

                        </Box>
                    </Box>
                </Container>
            </Card>
        )
    }
}

export default ConstraintColumn