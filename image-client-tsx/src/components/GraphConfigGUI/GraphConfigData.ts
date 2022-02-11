import GridGraph from "../../elements/graphs/GridGraph"
import OneAxisGraph from "../../elements/graphs/OneAxisGraph"
import TwoAxisGraph from "../../elements/graphs/TwoAxisGraph"
import Graph from "../../elements/interfaces/Graph"
import { GraphConfiguration } from "../../elements/types"

export enum InputType {
    PROPERTY,

    /*
    # = required

    EXTRA PROPERTIES:
        defaultValue: integer - initialValue (default: 20)
        step: integer - size of the steps on the slider (default: 1)
        min: integer - minimum value of slider (default: 0)
        max: integer - maximum value of the slider (default: 100)
    */
    INT
}

export type InputDescription = {
    name: string,
    type: InputType,
    extra?: {[name: string]: any}
}

class GraphCreator<T extends Graph> {
    constructor(public readonly graphClass: new (config: GraphConfiguration) => T) {
    }
}

const GraphConfigData: {
    [name: string]: {vars: InputDescription[], creator: GraphCreator<Graph>}
} = {
    "Grid": {
        vars: [
            {
                name: "columns",
                type: InputType.INT,
                extra: {
                    defaultValue: 20,
                    step: 5,
                    min: 10,
                    max: 40
                }
            }
        ],
        creator: new GraphCreator(GridGraph)
    },
    "OneAxis": {
        vars: [
            {
                name: "x",
                type: InputType.PROPERTY
            }
        ],
        creator: new GraphCreator(OneAxisGraph) 
    },
    "TwoAxis": {
        vars: [
            {
                name: "x",
                type: InputType.PROPERTY
            },
            {
                name: "y",
                type: InputType.PROPERTY
            }
        ],
        creator: new GraphCreator(TwoAxisGraph) 
    }
}

export default GraphConfigData