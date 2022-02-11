import { InputType } from "./GraphConfigData";
import PropertyInput from "./input-components/PropertyInput";
import IntegerInput from "./input-components/IntegerInput";

function createInputComponent(paramName: string, initialValue: any, onParamChange: (paramName: string, value: any) => void, type: InputType, extra: {[name: string]: any}) {
    switch (type) {
        case InputType.PROPERTY:
            return (
                <PropertyInput key={paramName} paramName={paramName} initialValue={initialValue} onParamChange={onParamChange} extra={extra}/>
            );
        case InputType.INT:
            return (
                <IntegerInput paramName={paramName} initialValue={initialValue} onParamChange={onParamChange} extra={extra}/>
            );
        default:
            throw new Error("No input component defined for type '" + type + "'");
    }
}

export default createInputComponent