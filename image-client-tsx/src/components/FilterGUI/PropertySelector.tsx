import { Button, Menu, MenuItem } from "@material-ui/core";
import React, { MouseEvent } from "react";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { getItemDescription } from "../../specific/specific";
import ItemPropertyStorage from "../../elements/ItemPropertyStorage";

class PropertySelector extends React.Component<{addProperty: (property: string) => void, existingProperties: string[]}, {anchor: HTMLElement | null}> {

    filterProperties: string[] = []

    constructor(props: {addProperty: (property: string) => void, existingProperties: string[]}) {
        super(props)
        this.state = {
            anchor: null,
        }

        this.closeMenu = this.closeMenu.bind(this)
        this.btnClick = this.btnClick.bind(this);
        this.propertyClicked = this.propertyClicked.bind(this);

        let desc = getItemDescription();
        for (let prop in desc) {
            if (desc[prop].filter) {
                this.filterProperties.push(prop)
            }
        }
    }

    btnClick(event: MouseEvent<HTMLButtonElement>) {
        this.setState({anchor: event.currentTarget})
    }

    closeMenu() {
        this.setState({anchor: null})
    }

    propertyClicked(event: MouseEvent<HTMLElement>) {
        let propName = event.currentTarget.getAttribute("data-property")!!
        this.props.addProperty(propName);

        this.closeMenu();
    }

    render() {

        return (
            <>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon />}
                    aria-controls="dropdown"
                    aria-haspopup="true"
                    onClick={this.btnClick}
                >Add</Button>
                <Menu
                    id="dropdown"
                    keepMounted
                    anchorEl={this.state.anchor}
                    open={Boolean(this.state.anchor)}
                    onClose={this.closeMenu}
                >
                    {
                        this.filterProperties.filter(prop => !this.props.existingProperties.includes(prop)).map(prop =>
                            <MenuItem data-property={prop} onClick={this.propertyClicked}>{getItemDescription()[prop].displayName}</MenuItem>
                        )
                    }
                </Menu>
            </>
        );
    }
}

export default PropertySelector