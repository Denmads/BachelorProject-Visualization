import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, DialogContent } from '@material-ui/core';
import PropertySelector from './PropertySelector';
import ConstraintColumn from './ConstraintColumn';
import styles from "./FilterDialog.module.css";
import ItemPropertyStorage from '../../elements/ItemPropertyStorage';
import Constraint from '../../elements/objects/Constraint';


class FilterDialog extends React.Component<{onClose: () => void, open: boolean}, {columns: {[name: string]: Constraint[]}, update: boolean}>{

    constructor(props: {onClose: () => void, open: boolean}) {
        super(props);
        this.addProperty = this.addProperty.bind(this);
        this.deleteProperty = this.deleteProperty.bind(this);
        this.setConstraints = this.setConstraints.bind(this);

        this.state = {
            columns: ItemPropertyStorage.getFilter(),
            update: false
        }

        this.onClose = this.onClose.bind(this);
    }

    addProperty(property: string) {
        this.setState(state => {
            let prevColumns = {...state.columns};
            prevColumns[property] = [];
            return {
                ...state,
                columns: prevColumns
            };
        })
    }

    setConstraints(property: string, constraints: Constraint[]) {
        this.setState(state => {
            let prevColumns = {...state.columns};
            prevColumns[property] = constraints
            return {
                ...state,
                columns: prevColumns
            };
        })
    }

    deleteProperty(property: string) {
        this.setState(state => {
            let prevColumns = {...state.columns};
            delete prevColumns[property];
            return {columns: prevColumns};
        });
    }

    onClose() {
        this.props.onClose();
        ItemPropertyStorage.clearFilter();

        for (let prop in this.state.columns) {
            for (let con of this.state.columns[prop]) {
                ItemPropertyStorage.addConstraint(prop, con);
            }
        }

        this.setState(state => ({
            ...state,
            update: true
        }))
    }

    componentDidUpdate() {
        if (this.state.update) {
            setTimeout(() => {
                this.setState(state => ({
                    ...state,
                    update: false
                }))

                ItemPropertyStorage.updateItems();
            }, 500)
        }
    }


    render() {
        return (
            <Dialog 
                onClose={this.onClose} 
                open={this.props.open}
                fullWidth={true}
                maxWidth={"lg"}
                >
                <DialogTitle>Filters</DialogTitle>
                <DialogContent>
                    <PropertySelector existingProperties={Object.keys(this.state.columns)} addProperty={this.addProperty}/>
                    <hr />
                    <Box display="flex" className={styles.columnContainer}>
                        {
                            Object.keys(this.state.columns).map(prop => <ConstraintColumn propertyName={prop} deleteProperty={this.deleteProperty} setConstraints={this.setConstraints} constraints={this.state.columns[prop]}></ConstraintColumn>)
                        }
                    </Box>
                </DialogContent>
            </Dialog>
        );
    }
}

export default FilterDialog