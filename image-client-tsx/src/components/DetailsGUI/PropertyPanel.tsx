import React from "react";
import { PropertyDescription } from "../../elements/types"
import { Box } from "@material-ui/core";
import PropertyPanelFactory from "./PropertyPanelFactory"
import { PropertyType } from "../../elements/objects/PropertyType";
import RenderItem from "../../elements/objects/RenderItem";

class PropertyPanel extends React.Component<{name: string, description: PropertyDescription, item: RenderItem},{}>{

    render() {
        return (
            <Box>
                <h3>{this.props.description.displayName}</h3>
                <hr />
                {
                    PropertyPanelFactory.create(this.props.description.valueType, this.props.name, this.props.item)
                }
            </Box>
        )
    }
}

export default PropertyPanel