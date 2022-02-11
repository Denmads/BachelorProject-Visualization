import ItemPropertyStorage from "../../elements/ItemPropertyStorage";
import RenderController from "./RenderController";

type MouseInfo = {
    previousPosition: {
        x: number,
        y: number
    },
    down: boolean,
    dragged: boolean
}

class InputHandler {
    controller: RenderController
    mouse: MouseInfo

    constructor(canvas: HTMLCanvasElement, controller: RenderController) {
        this.controller = controller;

        this.mouse = {
            previousPosition: {
                x: 0,
                y: 0
            },
            down: false,
            dragged: false
        }

        canvas.addEventListener("wheel", this.scroll.bind(this))
        canvas.addEventListener("mousemove", this.mouseMove.bind(this))
        canvas.addEventListener("mousedown", this.mouseDown.bind(this))
        canvas.addEventListener("mouseup", this.mouseUp.bind(this))
        canvas.addEventListener("mouseout", this.mouseUp.bind(this))
    }

    scroll(event: WheelEvent) {
        if (event.deltaY < 0) {
            this.controller.scaleDown();
        }
        else {
            this.controller.scaleUp();
        }
    
        event.preventDefault();
    }

    mouseMove(event: MouseEvent) {
        if (this.mouse.down) {
            this.controller.addOffset(
                (event.clientX - this.mouse.previousPosition.x) * 1/this.controller.getScale(),
                (event.clientY - this.mouse.previousPosition.y) * 1/this.controller.getScale()
            );
            this.mouse.previousPosition.x = event.clientX;
            this.mouse.previousPosition.y = event.clientY;
            
            this.mouse.dragged = true;
        }
    }

    mouseDown(event: MouseEvent) {
        this.mouse.previousPosition.x = event.clientX;
        this.mouse.previousPosition.y = event.clientY;
        this.mouse.down = true;
        this.mouse.dragged = false;
    }

    mouseUp(event: MouseEvent) {
        if (!this.mouse.dragged && this.mouse.down) {
            this.controller.clicked(event.clientX, event.clientY);
        }

        this.mouse.down = false;
    }
}

export default InputHandler