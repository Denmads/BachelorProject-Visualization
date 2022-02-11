import Graph from "../interfaces/Graph";
import ItemProperties from "../objects/ItemProperties";
import Rect from "../objects/Rect";
import Vector2 from "../objects/Vector2";
import RenderItemStorage from "../RenderItemStorage";
import ViewParameters from "../types";

class GridGraph extends Graph {

    columns: number = 0;

    initialize(viewParams: ViewParameters): void {
        this.columns = this.configuration.columns;
    }

    getCoordinates(items: ItemProperties, index: number, itemSize: Vector2): Vector2 {
        return new Vector2((itemSize.x + 15) * (index % this.columns), Math.floor(index / this.columns) * (itemSize.y + 15));
    }
    renderUI(context: CanvasRenderingContext2D, viewParams: ViewParameters): void {
        
    }

    renderContent(context: CanvasRenderingContext2D, viewParams: ViewParameters) {
        let items = RenderItemStorage.getRenderItems(new Rect(viewParams.upperLeftCoord, new Vector2(viewParams.scaledWidth, viewParams.scaledHeight)));
        for (let item of items) {
            context.drawImage(item.getImage(), item.boundingBox.position.x, item.boundingBox.position.y, item.boundingBox.size.x, item.boundingBox.size.y);
        }
    }
    
}

export default GridGraph