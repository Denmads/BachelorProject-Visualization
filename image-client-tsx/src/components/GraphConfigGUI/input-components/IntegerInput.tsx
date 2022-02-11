import { FormControl, InputLabel, Slider, Typography } from "@material-ui/core";
import { ChangeEvent } from "react";
import InputComponent from "../InputComponent";

class IntegerInput extends InputComponent {

    onSliderChange(event: ChangeEvent<{}>, value: number | number[]): void {
        this.props.onParamChange(this.props.paramName, value);
    }

    render() {
        return (
            <FormControl style={{minWidth: "200px"}}>
                <Typography id={this.props.paramName+"-label"} gutterBottom>
                    {this.props.paramName}
                </Typography>
                <Slider 
                    defaultValue={this.props.initialValue}
                    aria-labelledby={this.props.paramName+"-label"}
                    valueLabelDisplay="auto"
                    marks
                    step={("step" in this.props.extra ? this.props.extra.step : 1)}
                    min={("min" in this.props.extra ? this.props.extra.min : 0)}
                    max={("max" in this.props.extra ? this.props.extra.max : 100)}
                    onChange={this.onSliderChange.bind(this)}
                />
            </FormControl>
        );
    }
}

export default IntegerInput