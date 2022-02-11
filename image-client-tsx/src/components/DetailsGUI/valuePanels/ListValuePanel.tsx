import RenderItem from "../../../elements/objects/RenderItem"
import React from "react";

class ListValuePanel extends React.Component<{name: string, item: RenderItem}, {}> {

    render() {
        return (
            <ul>
                {
                    this.props.item.properties.getProperty(this.props.name).map((val: any) => {
                        return (<li>{val}</li>)
                    })
                }
            </ul>
        )
    }
}

export default ListValuePanel