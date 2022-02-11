import ItemProperties from "../objects/ItemProperties";
import { PropertyType } from "../objects/PropertyType";
import RenderItem from "../objects/RenderItem";
import Vector2 from "../objects/Vector2";
import ViewParameters from "../types";

export enum TickDirection {
    UP, DOWN, LEFT, RIGHT
}

abstract class Axis {
    protected startPoint: Vector2;
    protected endPoint: Vector2;

    private axisLength: number;
    private axisUnitVec: Vector2;

    protected middleCoord: Vector2;
    protected axisOffset: number;

    protected tickDirection: TickDirection;
    private tickSize: number = 10;
    private fontSize: number = 20;

    private pixelsPerTick: number = 100;
    protected pixelsPerTickScaled: number = 100;

    protected property: {displayName: string, propertyName: string, propertyType: PropertyType, propertyUnit: string};
    private unitCoord: Vector2;

    constructor(start: Vector2, end: Vector2, direction: TickDirection, property: {displayName: string, propertyName: string, propertyType: PropertyType, propertyUnit: string}) {
        this.startPoint = start;
        this.endPoint = end;
        this.tickDirection = direction;
        this.property = property;

        let xDiff = this.endPoint.x - this.startPoint.x;
        let yDiff = this.endPoint.y - this.startPoint.y;

        this.axisLength = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        this.axisUnitVec = new Vector2(xDiff / this.axisLength, yDiff / this.axisLength);

        this.middleCoord = this.startPoint.copy().add(0.5 * this.getAxisLength() * this.getAxisUnitVec().x, 0.5 * this.getAxisLength() * this.getAxisUnitVec().y);
        this.axisOffset = 0;

        if (this.tickDirection == TickDirection.DOWN) {
            this.unitCoord = this.middleCoord.copy().add(0, this.tickSize + this.fontSize + 5);
        }
        else if (this.tickDirection == TickDirection.UP) {
            this.unitCoord = this.middleCoord.copy().add(0, -(this.tickSize + this.fontSize + 5));
        }
        else if (this.tickDirection == TickDirection.LEFT) {
            this.unitCoord = this.middleCoord.copy().add(-(this.tickSize + this.fontSize + 5), 0);
        }
        else if (this.tickDirection == TickDirection.RIGHT) {
            this.unitCoord = this.middleCoord.copy().add(this.tickSize + this.fontSize + 5, 0);
        }
        else {
            this.unitCoord = new Vector2();
        }
    }

    getAxisLength(): number {
        return this.axisLength;
    }

    getAxisUnitVec(): Vector2 {
        return this.axisUnitVec;
    }

    setContextPropertiesForTick(context: CanvasRenderingContext2D) {
        context.font = this.fontSize + "px Arial";
        context.fillStyle = "black";
        context.strokeStyle = "black";
        if (this.tickDirection == TickDirection.DOWN) {
            context.textAlign = "center";
            context.textBaseline = "top";
        }
        else if (this.tickDirection == TickDirection.UP) {
            context.textAlign = "center";
            context.textBaseline = "bottom";
        }
        else if (this.tickDirection == TickDirection.LEFT) {
            context.textAlign = "right";
            context.textBaseline = "middle";
        }
        else if (this.tickDirection == TickDirection.RIGHT) {
            context.textAlign = "left";
            context.textBaseline = "middle";
        }
    }

    getTickEnd (tickStart: Vector2): Vector2 {
        let startCopy = tickStart.copy();
        if (this.tickDirection == TickDirection.DOWN) {
            startCopy.add(0, this.tickSize);
        }
        else if (this.tickDirection == TickDirection.UP) {
            startCopy.add(0, -this.tickSize);
        }
        else if (this.tickDirection == TickDirection.LEFT) {
            startCopy.add(-this.tickSize, 0);
        }
        else if (this.tickDirection == TickDirection.RIGHT) {
            startCopy.add(this.tickSize, 10);
        }
        return startCopy;
    }

    abstract getCoordinate(item: ItemProperties): Vector2;

    update(viewParams: ViewParameters): void {
        this.axisOffset = viewParams.translation.dot(this.getAxisUnitVec());
        this.pixelsPerTickScaled = viewParams.scale * this.pixelsPerTick;
    }

    render(context: CanvasRenderingContext2D) {
        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        
        context.beginPath();
        context.moveTo(this.startPoint.x, this.startPoint.y);
        context.lineTo(this.endPoint.x, this.endPoint.y);
        context.stroke();
        
        context.save();
        context.font = "25px Arial";
        context.fillStyle = "#000000";
        context.translate(this.unitCoord.x, this.unitCoord.y);
        if (this.tickDirection == TickDirection.DOWN) {
            context.textAlign = "center";
            context.textBaseline = "top";
        }
        else if (this.tickDirection == TickDirection.UP) {
            context.textAlign = "center";
            context.textBaseline = "bottom";
        }
        else if (this.tickDirection == TickDirection.LEFT) {
            context.textAlign = "center";
            context.textBaseline = "bottom";
            context.rotate(-90 * Math.PI / 180)
        }
        else if (this.tickDirection == TickDirection.RIGHT) {
            context.textAlign = "center";
            context.textBaseline = "bottom";
            context.rotate(90 * Math.PI / 180)
        }
        context.fillText(this.property.displayName + (this.property.propertyUnit !== "" ? " (" + this.property.propertyUnit + ")" : ""), 0, 0);
        context.restore();
    }
}

export default Axis