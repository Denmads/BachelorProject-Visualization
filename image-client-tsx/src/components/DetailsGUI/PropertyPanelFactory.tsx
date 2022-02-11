import React from "react";
import { PropertyType } from "../../elements/objects/PropertyType";
import RenderItem from "../../elements/objects/RenderItem";
import SimpleValuePanel from "./valuePanels/SimpleValuePanel"
import ListValuePanel from "./valuePanels/ListValuePanel"

class PropertyPanelFactory {

    static create(type: PropertyType, name: string, item: RenderItem): JSX.Element {
        switch(type) {
            case PropertyType.STRING:
            case PropertyType.INTEGER:
            case PropertyType.FLOAT:
                return (<SimpleValuePanel name={name} item={item}></SimpleValuePanel>)
            case PropertyType.STRING_LIST:
                return (<ListValuePanel name={name} item={item}></ListValuePanel>)
            default:
                return (<p>Not Supported</p>)
        }
    }
}

export default PropertyPanelFactory