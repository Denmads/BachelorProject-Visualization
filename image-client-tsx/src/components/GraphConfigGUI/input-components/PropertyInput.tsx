import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { ChangeEvent } from "react";
import { PropertyType } from "../../../elements/objects/PropertyType";
import { getItemDescription } from "../../../specific/specific";
import InputComponent from "../InputComponent";

class PropertyInput extends InputComponent {
    
    axisOptions: {codeName: string, name: string, type: PropertyType, unit: string}[] = []

    state = {
        inputState: this.props.initialValue.propertyName !== "" ? this.props.initialValue.index : 0
    }

    constructor(props: { paramName: string; initialValue: any; onParamChange: (paramName: string, value: any) => void; extra: {[name: string]: any}; } | Readonly<{ paramName: string; initialValue: any; onParamChange: (paramName: string, value: any) => void; extra: {[name: string]: any}; }>) {
        super(props);

        let itemDesc = getItemDescription();
        for (let prop in itemDesc) {
            if (itemDesc[prop].display) {
                this.axisOptions.push({codeName: prop, name: itemDesc[prop].displayName, type: itemDesc[prop].valueType, unit: itemDesc[prop].display!.unit});
            }
        }

        this.props.onParamChange(this.props.paramName, {
            displayName: this.axisOptions[this.state.inputState].name,
            propertyName: this.axisOptions[this.state.inputState].codeName,
            propertyType: this.axisOptions[this.state.inputState].type,
            propertyUnit: this.axisOptions[this.state.inputState].unit,
            index: this.state.inputState
        });
    }

    onSelectChange(event: ChangeEvent<{name?: string, value: unknown}>): void {
        this.props.onParamChange(this.props.paramName, {
            displayName: this.axisOptions[event.target.value as number].name,
            propertyName: this.axisOptions[event.target.value as number].codeName,
            propertyType: this.axisOptions[event.target.value as number].type,
            propertyUnit: this.axisOptions[event.target.value as number].unit,
            index: event.target.value as number
        });
        this.setState(state => ({inputState: event.target.value as number}))
    }

    render() {
        return (
            <FormControl style={{minWidth: "200px"}}>
                <InputLabel key={this.props.paramName+"-label"} id={this.props.paramName+"-label"}>{this.props.paramName}</InputLabel>
                <Select
                name={this.props.paramName}
                labelId={this.props.paramName+"-label"}
                id={this.props.paramName+"-select"}
                value={this.state.inputState}
                onChange={this.onSelectChange.bind(this)}
                >
                {
                    this.axisOptions.map((prop, index) => {
                        return (<MenuItem value={index}>{prop.name}</MenuItem>)
                    })
                }
                </Select>
            </FormControl>
        );
    }
}

export default PropertyInput