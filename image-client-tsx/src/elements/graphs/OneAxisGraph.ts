import NumberAxis from '../Axes/NumberAxis'
import Axis, { TickDirection } from '../interfaces/Axis'
import Graph from '../interfaces/Graph'
import ItemProperties from '../objects/ItemProperties'
import Rect from "../objects/Rect";
import Vector2 from "../objects/Vector2";
import RenderItemStorage from "../RenderItemStorage";
import ViewParameters from '../types'
import AxisFactory from "../Axes/AxisFactory";

class OneAxisGraph extends Graph {
    private axis: Axis | null = null;

    private viewPixelHeight: number = 0;

    private stacks: {[name: string]: number} = {}

    initialize(viewParams: ViewParameters): void {
        this.axis = AxisFactory.create(new Vector2(50, viewParams.pixelHeight - 75), new Vector2(viewParams.pixelWidth - 50, viewParams.pixelHeight - 75), TickDirection.DOWN, this.configuration.x);
        this.viewPixelHeight = viewParams.pixelHeight;
    }

    getCoordinates(item: ItemProperties, index: number, itemSize: Vector2): Vector2 {
        let axisCoord = this.axis?.getCoordinate(item);

        if (!(axisCoord!!.x.toString() in this.stacks)) {
            this.stacks[axisCoord!!.x.toString()] = 0
        }

        return new Vector2(axisCoord?.x, this.viewPixelHeight - 300 - (this.stacks[axisCoord!!.x.toString()]++ * RenderItemStorage.DEFAULT_IMG_SIZE.y));
    }

    renderUI(context: CanvasRenderingContext2D, viewParams: ViewParameters): void {
        this.axis?.update(viewParams);
        this.axis?.render(context);
    }

    renderContent(context: CanvasRenderingContext2D, viewParams: ViewParameters) {
        let items = RenderItemStorage.getRenderItems(new Rect(viewParams.upperLeftCoord, new Vector2(viewParams.scaledWidth, viewParams.scaledHeight)));
        for (let item of items) {
            context.drawImage(item.getImage(), item.getXCoord(), item.getYCoord(), item.boundingBox.size.x, item.boundingBox.size.y);
        }
    }
}

export default OneAxisGraph