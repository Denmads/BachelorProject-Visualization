import Vector2 from "./Vector2";

class Rect {
    position: Vector2
    size: Vector2

    constructor(position: Vector2 = new Vector2(0, 0), size: Vector2 = new Vector2(0, 0)) {
        this.position = position;
        this.size = size;
    }

    containsPoint(point: Vector2) {
        return point.x >= this.position.x && point.x <= this.position.x + this.size.x && point.y >= this.position.y && point.y <= this.position.y + this.size.y;
    }

    collides(other: Rect) {
        return !(
            this.position.x > other.position.x + other.size.x ||
            this.position.x + this.size.x < other.position.x ||
            this.position.y > other.position.y + other.size.y ||
            this.position.y + this.size.y < other.position.y
        );
    }

    topLeftPoint(): Vector2 {
        return this.position.copy();
    }

    topRightPoint(): Vector2 {
        return new Vector2(this.position.x + this.size.x, this.position.y);
    }

    bottomLeftPoint(): Vector2 {
        return new Vector2(this.position.x, this.position.y + this.size.y);
    }

    bottomRightPoint(): Vector2 {
        return new Vector2(this.position.x + this.size.x, this.position.y + this.size.y);
    }
}

export default Rect