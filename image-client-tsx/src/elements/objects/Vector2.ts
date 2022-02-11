class Vector2 {
    x: number
    y: number

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    add(x: number, y: number): Vector2 {
        this.x += x;
        this.y += y;
        return this;
    }

    norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    dot(other: Vector2): number{
        return this.x * other.x + this.y * other.y;
    }

    distSqr(to: Vector2): number {
        let xDiff = to.x - this.x;
        let yDiff = to.y - this.y;
        return xDiff * xDiff + yDiff * yDiff;
    }

    copy(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    toString() {
        return "{X: " + this.x + ", Y: " + this.y + "}";
    }
}

export default Vector2