import RenderItem from "../../../elements/objects/RenderItem"
import React from "react";

class SimpleValuePanel extends React.Component<{name: string, item: RenderItem}, {}> {

    render() {
        return (
            <p>{this.props.item.properties.getProperty(this.props.name)}</p>
        )
    }
}

export default SimpleValuePanel