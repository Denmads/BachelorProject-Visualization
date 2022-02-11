import NumberAxis from '../Axes/NumberAxis';
import Axis, { TickDirection } from '../interfaces/Axis';
import Graph from '../interfaces/Graph'
import ItemProperties from '../objects/ItemProperties'
import Rect from "../objects/Rect";
import Vector2 from "../objects/Vector2";
import RenderItemStorage from "../RenderItemStorage";
import ViewParameters from '../types'
import AxisFactory from "../Axes/AxisFactory"

class TwoAxisGraph extends Graph {

    private xAxis: Axis | null = null;
    private yAxis: Axis | null = null;

    initialize(viewParams: ViewParameters): void {
        this.xAxis = AxisFactory.create(new Vector2(0/*75*/, viewParams.pixelHeight - 75), new Vector2(viewParams.pixelWidth /*- 50*/, viewParams.pixelHeight - 75), TickDirection.DOWN, this.configuration.x);
        this.yAxis = AxisFactory.create(new Vector2(75, viewParams.pixelHeight /*- 75*/), new Vector2(75, 0 /*50*/), TickDirection.LEFT, this.configuration.y);
    }

    getCoordinates(item: ItemProperties, index: number, itemSize: Vector2): Vector2 {
        let xAxisCoord = this.xAxis?.getCoordinate(item);
        let yAxisCoord = this.yAxis?.getCoordinate(item);
        return new Vector2(xAxisCoord!.x, yAxisCoord!.y);
    }
    renderUI(context: CanvasRenderingContext2D, viewParams: ViewParameters): void {
        this.xAxis!.update(viewParams);
        this.yAxis!.update(viewParams);
        this.xAxis!.render(context);
        this.yAxis!.render(context);
    }

    renderContent(context: CanvasRenderingContext2D, viewParams: ViewParameters) {
        let items = RenderItemStorage.getRenderItems(new Rect(viewParams.upperLeftCoord, new Vector2(viewParams.scaledWidth, viewParams.scaledHeight)));
        for (let item of items) {
            context.drawImage(item.getImage(), item.getXCoord(), item.getYCoord(), item.boundingBox.size.x, item.boundingBox.size.y);
        }
    }
}

export default TwoAxisGraph