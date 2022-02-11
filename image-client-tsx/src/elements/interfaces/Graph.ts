import ItemProperties from '../objects/ItemProperties';
import Vector2 from '../objects/Vector2';
import { GraphConfiguration, ViewParameters } from '../types';

abstract class Graph {

    protected configuration: GraphConfiguration;

    constructor(config: GraphConfiguration) {
        this.configuration = config;
    }

    abstract initialize(viewParams: ViewParameters): void;

    abstract renderUI(context: CanvasRenderingContext2D, viewParams: ViewParameters): void;

    abstract renderContent(context: CanvasRenderingContext2D, viewParams: ViewParameters): void

    abstract getCoordinates(item: ItemProperties, index: number, itemSize: Vector2): Vector2;
}

export default Graph