import Vector2 from "../../elements/objects/Vector2";
import ViewParameters from "../../elements/types";
import Graph from "../../elements/interfaces/Graph";
import GridGraph from "../../elements/graphs/GridGraph";
import RenderItemStorage from "../../elements/RenderItemStorage";
import Rect from "../../elements/objects/Rect";
import DataConnector from "../../elements/interfaces/DataConnector";
import { getDataConnectorInstance } from "../../specific/specific";
import ImageState from "../../elements/ImageState";
import GraphConfigData from "../GraphConfigGUI/GraphConfigData";
import DetailManager from "../../elements/DetailsManager";



class RenderController {

    static CurrentGraph: Graph = new GridGraph({});

    private static onSetGraphListeners: {(graph: Graph): void}[] = [];

    static SetCurrentGraph(graph: Graph) {
        RenderController.CurrentGraph = graph;
        for (let listener of RenderController.onSetGraphListeners) {
            listener(graph);
        }
    }

    static instance: RenderController | null = null;

    canvasContext: CanvasRenderingContext2D;

    translation: Vector2 = new Vector2();

    currentScale: number = 1;
    scaleStep: number = 0.1;

    defaultTransform: DOMMatrix;
    contentTransform: DOMMatrix;

    viewParams: ViewParameters;

    amountForHighRes: number = 8;

    dataConnector: DataConnector;

    constructor(canvasContext: CanvasRenderingContext2D) {
        RenderController.instance = this;

        this.canvasContext = canvasContext;

        this.defaultTransform = canvasContext.getTransform()
        this.contentTransform = canvasContext.getTransform()

        this.viewParams = {
            translation: new Vector2(),
            upperLeftCoord: new Vector2(),
            scaledWidth: canvasContext.canvas.width,
            scaledHeight: canvasContext.canvas.height,
            pixelWidth: canvasContext.canvas.width,
            pixelHeight: canvasContext.canvas.height,
            scale: 1
        }

        this.dataConnector = getDataConnectorInstance();

        RenderController.onSetGraphListeners.push((graph: Graph) => {
            graph.initialize(this.viewParams);
        });

        RenderController.SetCurrentGraph(new GridGraph({
            columns: GraphConfigData["Grid"].vars[0].extra!.defaultValue
        }))
    }

    reset() {
        this.canvasContext.setTransform(this.contentTransform);
        this.canvasContext.resetTransform();
        this.contentTransformUpdated();
    }

    addOffset(x: number, y: number) {
        this.canvasContext.setTransform(this.contentTransform);
        this.canvasContext.translate(x, y);
        this.translation.add(x, y);
        this.contentTransformUpdated();
    }

    scaleUp() {
        this.canvasContext.setTransform(this.contentTransform);
        this.canvasContext.translate(-this.viewParams.translation.x/this.currentScale + this.viewParams.scaledWidth / 2, -this.viewParams.translation.y/this.currentScale + this.viewParams.scaledHeight / 2);
        this.canvasContext.scale((1 + this.scaleStep), (1 + this.scaleStep));
        this.canvasContext.translate(this.viewParams.translation.x/this.currentScale - this.viewParams.scaledWidth / 2, this.viewParams.translation.y/this.currentScale - this.viewParams.scaledHeight / 2);

        this.contentTransformUpdated();
    }

    scaleDown() {
        this.canvasContext.setTransform(this.contentTransform);
        this.canvasContext.translate(-this.viewParams.translation.x/this.currentScale + this.viewParams.scaledWidth / 2, -this.viewParams.translation.y/this.currentScale + this.viewParams.scaledHeight / 2);
        this.canvasContext.scale(1 / (1 + this.scaleStep), 1 / (1 + this.scaleStep));
        this.canvasContext.translate(this.viewParams.translation.x/this.currentScale - this.viewParams.scaledWidth / 2, this.viewParams.translation.y/this.currentScale - this.viewParams.scaledHeight / 2);

        this.contentTransformUpdated();
    }

    getScale() {
        return this.currentScale;
    }

    contentTransformUpdated() {
        this.contentTransform = this.canvasContext.getTransform();
        this.viewParams.translation.x = this.contentTransform.e;
        this.viewParams.translation.y = this.contentTransform.f;
        this.currentScale = this.contentTransform.a;

        this.viewParams.scaledWidth = this.viewParams.pixelWidth * 1 / this.currentScale;
        this.viewParams.scaledHeight = this.viewParams.pixelHeight * 1 / this.currentScale;

        this.viewParams.upperLeftCoord.x = -(this.contentTransform.e / this.currentScale);
        this.viewParams.upperLeftCoord.y = -(this.contentTransform.f / this.currentScale);

        this.viewParams.scale = this.currentScale;
    }

    clickedCoord: Vector2 = new Vector2();
    clicked(x: number, y: number) {
        let worldX = this.viewParams.upperLeftCoord.x + (x / this.currentScale);
        let worldY = this.viewParams.upperLeftCoord.y + (y / this.currentScale);

        this.clickedCoord = new Vector2(worldX, worldY);

        let items = RenderItemStorage.getRenderItemOnPoint(new Vector2(worldX, worldY));

        if (items.length > 0) {
            if (items[0].getImageState() == ImageState.LOW_RES) {
                this.dataConnector.fetchImage(items[0].properties, ImageState.HIGH_RES, true).then(val => {
                    items[0].setImageState(val.state)
                    items[0].setImage(val.image);
                    DetailManager.show(items[0]);
                })
            }
            else {
                DetailManager.show(items[0]);
            }

        }
    }

    startRendering() {
        this.render.bind(this);
        this.render();
    }

    render() {
        let items = RenderItemStorage.getRenderItems(new Rect(this.viewParams.upperLeftCoord, new Vector2(this.viewParams.scaledWidth, this.viewParams.scaledHeight)));

        if (items.length <= this.amountForHighRes) {
            for (let item of items) {
                if (item.getImageState() == ImageState.LOW_RES) {
                    item.setImageState(ImageState.HIGH_RES);
                    this.dataConnector.fetchImage(item.properties, ImageState.HIGH_RES, true).then(img => {
                        item.setImageState(img.state);
                        item.setImage(img.image);
                    });
                }
            }
        }
        
        this.canvasContext.setTransform(this.defaultTransform);
        this.canvasContext.clearRect(0, 0, this.viewParams.pixelWidth, this.viewParams.pixelHeight);

        this.canvasContext.setTransform(this.contentTransform);
        RenderController.CurrentGraph.renderContent(this.canvasContext, this.viewParams);    

        this.canvasContext.setTransform(this.defaultTransform);
        RenderController.CurrentGraph.renderUI(this.canvasContext, this.viewParams);
        
        window.requestAnimationFrame(this.render.bind(this))
    }
}

export default RenderController