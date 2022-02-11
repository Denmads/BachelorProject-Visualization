import DataConnector from "./interfaces/DataConnector";
import Graph from "./interfaces/Graph";
import QuadTree from "./objects/QuadTree";
import Vector2 from "./objects/Vector2";
import {compareItemProperties, getDataConnectorInstance} from '../specific/specific';
import Rect from "./objects/Rect";
import RenderItem from "./objects/RenderItem";
import ImageState from "./ImageState";
import ItemPropertyStorage from "./ItemPropertyStorage";
import RenderController from "../components/RenderView/RenderController";
import ItemProperties from "./objects/ItemProperties";

class RenderItemStorage {
    static DEFAULT_IMG_SIZE: Vector2 = new Vector2(100, 100);

    private static connector: DataConnector;

    private static renderableCollection: QuadTree;

    private static quadTreeThreshold = 3;

    static initialize() {
        this.connector = getDataConnectorInstance();
        this.renderableCollection = new QuadTree(new Rect(), this.quadTreeThreshold);
    }

    static recreateQuadTreeWithoutReload() {
        let minCoord = new Vector2();
        let maxCoord = new Vector2();

        let allItems = this.getAllRenderItems();
        allItems.forEach((item, index) => {
            let coord = RenderController.CurrentGraph.getCoordinates(item.properties, index, this.DEFAULT_IMG_SIZE);
            coord.x -= this.DEFAULT_IMG_SIZE.x/2;
            coord.y -= this.DEFAULT_IMG_SIZE.y/2;
            
            if (coord.x < minCoord.x) {
                minCoord.x = coord.x;
            }
            else if (coord.x + this.DEFAULT_IMG_SIZE.x > maxCoord.x) {
                maxCoord.x = coord.x + this.DEFAULT_IMG_SIZE.x;
            }

            if (coord.y < minCoord.y) {
                minCoord.y = coord.y;
            }
            else if (coord.y + this.DEFAULT_IMG_SIZE.y > maxCoord.y) {
                maxCoord.y = coord.y + this.DEFAULT_IMG_SIZE.y;
            }

            item.boundingBox.position = coord;
        })

        this.renderableCollection = new QuadTree(new Rect(minCoord, new Vector2(Math.max(Math.max(maxCoord.x - minCoord.x, 100), maxCoord.y - minCoord.y),Math.max(Math.max(maxCoord.x - minCoord.x, 100), maxCoord.y - minCoord.y))), 3);
        allItems.forEach(item => {
            this.renderableCollection.addItem(item);
            this.renderableCollection.addItem(item, QuadTree.ItemOrigin.BOTTOM_RIGHT);
        })

        this.goToItem(allItems[0]);
    }

    static recreateQuadTree() {
        let minCoord = new Vector2();
        let maxCoord = new Vector2();
        let renderItems: RenderItem[] = [];

        ItemPropertyStorage.getItems().forEach((item, index) => {
            let coord = RenderController.CurrentGraph.getCoordinates(item, index, this.DEFAULT_IMG_SIZE);
            
            if (coord.x < minCoord.x) {
                minCoord.x = coord.x;
            }
            else if (coord.x > maxCoord.x) {
                maxCoord.x = coord.x;
            }

            if (coord.y < minCoord.y) {
                minCoord.y = coord.y;
            }
            else if (coord.y > maxCoord.y) {
                maxCoord.y = coord.y;
            }

            let existingItem = this.findRenderItem(item);
            if (existingItem == null) {
                renderItems.push(new RenderItem(item, new Rect(coord, this.DEFAULT_IMG_SIZE)));
            }
            else {
                existingItem.boundingBox.position = coord;
                renderItems.push(existingItem);
            }
            
        })

        this.renderableCollection = new QuadTree(new Rect(minCoord, new Vector2(Math.max(Math.max(maxCoord.x - minCoord.x, 100), maxCoord.y - minCoord.y),Math.max(Math.max(maxCoord.x - minCoord.x, 100), maxCoord.y - minCoord.y))), 3);
        renderItems.forEach((item, index, arr) => {
            this.connector.fetchImage(item.properties, ImageState.LOW_RES, index == arr.length-1).then(img => {
                item.setImageState(img.state)
                item.setImage(img.image);
            });
            this.renderableCollection.addItem(item);
            this.renderableCollection.addItem(item, QuadTree.ItemOrigin.BOTTOM_RIGHT);
        })

        this.goToItem(renderItems[0]);
    }

    static getRenderItems(rect: Rect): RenderItem[] {
        return this.renderableCollection.getItemsInRect(rect);
    }

    static getAllRenderItems(): RenderItem[] {
        return this.renderableCollection.getItemsInRect(this.renderableCollection.boundingBox);
    }

    static getRenderItemOnPoint(point: Vector2): RenderItem[] {
        let result = [];

        for (let item of this.getAllRenderItems()) {
            if (item.boundingBox.containsPoint(point)) {
                result.push(item);
            }
        }

        return result;
    }

    static findRenderItem(item: ItemProperties) : RenderItem | null {
        for (let renderItem of this.getAllRenderItems()) {
            if (compareItemProperties(item, renderItem.properties)) {
                return renderItem;
            }
        }

        return null;
    }

    static goToItem(item: RenderItem) {
        RenderController.instance!.reset();
        RenderController.instance?.addOffset(-item.boundingBox.position.x, -item.boundingBox.position.y);
    }
}

RenderItemStorage.initialize();

export default RenderItemStorage