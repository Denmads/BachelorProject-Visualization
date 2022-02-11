import Axis, { TickDirection } from "../interfaces/Axis";
import ItemProperties from "../objects/ItemProperties";
import { PropertyType } from "../objects/PropertyType";
import Vector2 from "../objects/Vector2";
import ViewParameters from "../types";

class NumberAxis extends Axis {

    

    ticks: {
        position: number, 
        label: string
    }[] = [];

    middleValue: number = 0;

    constructor(start: Vector2, end: Vector2, direction: TickDirection, property: {displayName: string, propertyName: string, propertyType: PropertyType, propertyUnit: string}) {
        super(start, end, direction, property);
        this.middleValue = (0.5 * this.getAxisLength()) / this.pixelsPerTickScaled;
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
                label: startValue + ""
            });

            startValue++;
        }
    }

    getCoordinate(item: ItemProperties): Vector2 {
        let propVal = item.getProperty(this.property.propertyName);
        if (!propVal)
            return new Vector2(0, 0);

        let itemVal = item.getProperty(this.property.propertyName);
        if (itemVal == null) {
            return new Vector2();
        }
        let valDiff =  (itemVal as number) - this.middleValue;
        let pixelsToItem = valDiff * this.pixelsPerTickScaled;
        let itemCoord = this.middleCoord.copy().add(pixelsToItem * this.getAxisUnitVec().x, pixelsToItem * this.getAxisUnitVec().y);

        return itemCoord;
    }

    render(canvasContext: CanvasRenderingContext2D) {
        super.render(canvasContext);

        super.setContextPropertiesForTick(canvasContext);


        for (let tick of this.ticks) {
            let tickStart = new Vector2(this.startPoint.x + this.getAxisUnitVec().x * tick.position, this.startPoint.y + this.getAxisUnitVec().y * tick.position);
            let tickEnd = this.getTickEnd(tickStart);
            canvasContext.beginPath();
            canvasContext.moveTo(tickStart.x, tickStart.y);
            canvasContext.lineTo(tickEnd.x, tickEnd.y);
            canvasContext.fillText(tick.label, tickEnd.x, tickEnd.y)
            canvasContext.stroke();
        }
    }
}

export default NumberAxis