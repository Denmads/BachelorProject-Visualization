import React from 'react';

abstract class InputComponent extends React.Component<{paramName: string, initialValue: any, onParamChange: (paramName: string, value: any) => void, extra: {[name: string]: any}}, {inputState: any}> {
    
}

export default InputComponent