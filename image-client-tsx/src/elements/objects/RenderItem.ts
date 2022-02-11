import ItemProperties from "./ItemProperties"
import PlaceholderImage from "./PlaceholderImage"
import Rect from './Rect';
import uuidv4 from '../utils';
import ImageState from "../ImageState"

class RenderItem {
    id: string
    properties: ItemProperties
    boundingBox: Rect

    private imageState: ImageState = ImageState.NO_IMAGE;
    private image: HTMLImageElement | null = null

    constructor(properties: ItemProperties, boundingBox: Rect) {
        this.properties = properties;
        this.boundingBox = boundingBox;
        this.id = uuidv4();
    }

    getXCoord(): number {
        return this.boundingBox.position.x;
    }

    getYCoord(): number {
        return this.boundingBox.position.y;
    }

    setImageState(state: ImageState) {
        this.imageState = state;
    }

    getImageState(): ImageState {
        return this.imageState;
    }

    setImage(img: HTMLImageElement) {
        this.image = img;
    }

    getImage(): HTMLImageElement {
        return this.image != null ? this.image : PlaceholderImage.getInstance();
    }
}

export default RenderItem