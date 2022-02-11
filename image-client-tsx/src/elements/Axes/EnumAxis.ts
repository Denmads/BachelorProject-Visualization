import Axis, { TickDirection } from "../interfaces/Axis";
import ItemProperties from "../objects/ItemProperties";
import { PropertyType } from "../objects/PropertyType";
import RenderItem from "../objects/RenderItem";
import Vector2 from "../objects/Vector2";
import RenderItemStorage from "../RenderItemStorage";
import ViewParameters from "../types";

class EnumAxis extends Axis{

    labels: string[] = [];
    ticks: {
        position: number, 
        label: string
    }[] = [];

    middleValue: number = 0;

    offsetHor: boolean;

    constructor(start: Vector2, end: Vector2, direction: TickDirection, property: {displayName: string, propertyName: string, propertyType: PropertyType, propertyUnit: string}) {
        super(start, end, direction, property);
        //Get all unique values
        for (let item of RenderItemStorage.getAllRenderItems()) {
            let value = item.properties.getProperty(property.propertyName);
            if (value) {
                if (!this.labels.includes(value as string)) {
                    this.labels.push(value as string);
                }
            }
        }
        this.middleValue = (0.5 * this.getAxisLength()) / this.pixelsPerTickScaled;

        this.offsetHor = this.tickDirection == TickDirection.DOWN || this.tickDirection == TickDirection.UP;
    }

    getCoordinate(item: ItemProperties): Vector2 {
        let propVal = item.getProperty(this.property.propertyName);
        if (!propVal)
            return new Vector2(0, 0);

        let itemVal = item.getProperty(this.property.propertyName);
        if (itemVal == null) {
            return new Vector2();
        }
        let valDiff =  this.labels.indexOf(itemVal as string) - this.middleValue;
        let pixelsToItem = valDiff * this.pixelsPerTickScaled;
        let halfUnitVector = new Vector2(this.pixelsPerTickScaled * this.getAxisUnitVec().x * 0.5, this.pixelsPerTickScaled * this.getAxisUnitVec().y * 0.5);
        let itemCoord = this.middleCoord.copy().add(pixelsToItem * this.getAxisUnitVec().x, pixelsToItem * this.getAxisUnitVec().y).add(halfUnitVector.x, halfUnitVector.y);

        return itemCoord;
    }
    
    update(viewParams: ViewParameters): void {
        super.update(viewParams);

        this.ticks = [];

        this.middleValue = (0.5 * this.getAxisLength()) / this.pixelsPerTickScaled - this.axisOffset / this.pixelsPerTickScaled;
        let startValue =  Math.floor(this.middleValue);

        let pixelsToTick = (this.middleValue % 1) * this.pixelsPerTickScaled;
        if (pixelsToTick < 0) {
            pixelsToTick = pixelsToTick + this.pixelsPerTickScaled;
        }

        let startCoord = this.middleCoord.copy().add(pixelsToTick * -this.getAxisUnitVec().x, pixelsToTick * -this.getAxisUnitVec().y);

        let oneUnitVector = new Vector2(this.pixelsPerTickScaled * this.getAxisUnitVec().x, this.pixelsPerTickScaled * this.getAxisUnitVec().y);

        let maxDist = (this.getAxisLength() * 0.5) ** 2;
        while (this.middleCoord.distSqr(startCoord) < maxDist) {
            startValue--;
            startCoord.add(-oneUnitVector.x, -oneUnitVector.y);
        }

        startValue++;
        startCoord.add(oneUnitVector.x, oneUnitVector.y);
        for (let i = Math.sqrt(this.startPoint.distSqr(startCoord)); i < this.getAxisLength(); i += this.pixelsPerTickScaled) {
            this.ticks.push({
                position: i,
                label: (startValue >= 0 && startValue < this.labels.length ? this.labels[startValue] : "")
            });

            startValue++;
        }
    }

    render(canvasContext: CanvasRenderingContext2D) {
        super.render(canvasContext);

        super.setContextPropertiesForTick(canvasContext);

        let last = null;
        for (let tick of this.ticks) {
            if (tick.label !== "") {
                let tickStart = new Vector2(this.startPoint.x + this.getAxisUnitVec().x * tick.position, this.startPoint.y + this.getAxisUnitVec().y * tick.position);
                let tickEnd = this.getTickEnd(tickStart);
                canvasContext.beginPath();
                canvasContext.moveTo(tickStart.x, tickStart.y);
                canvasContext.lineTo(tickEnd.x, tickEnd.y);
                canvasContext.fillText(tick.label, tickEnd.x + (this.offsetHor ? this.pixelsPerTickScaled / 2 : 0), tickEnd.y + (!this.offsetHor ? this.pixelsPerTickScaled / 2 : 0))
                canvasContext.stroke();
                last = tick.position;
            }
        }

        if (last != null && last + this.pixelsPerTickScaled < this.getAxisLength()) {
            let lastTickPos = last + this.pixelsPerTickScaled;
            let tickStart = new Vector2(this.startPoint.x + this.getAxisUnitVec().x * lastTickPos, this.startPoint.y + this.getAxisUnitVec().y * lastTickPos);
            let tickEnd = this.getTickEnd(tickStart);
            canvasContext.beginPath();
            canvasContext.moveTo(tickStart.x, tickStart.y);
            canvasContext.lineTo(tickEnd.x, tickEnd.y);
            canvasContext.stroke();
        }
    }
}

export default EnumAxis