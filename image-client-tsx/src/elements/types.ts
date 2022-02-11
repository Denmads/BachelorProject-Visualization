import { PropertyType } from "./objects/PropertyType";
import Vector2 from "./objects/Vector2";

export type ViewParameters = {
    translation: Vector2,
    upperLeftCoord: Vector2,
    scaledWidth: number,
    scaledHeight: number,
    pixelWidth: number,
    pixelHeight: number,
    scale: number
}

export type PropertyDescription = {
    displayName: string,
    valueType: PropertyType,
    filter: boolean,
    optional: boolean,
    display?: {
        unit: string
    }
}

export type ItemDescription = {
    [name: string]: PropertyDescription
}

export type Properties = {
    [name: string]: any
}

export type GraphConfiguration = {
    [name: string]: any
}

export default ViewParameters