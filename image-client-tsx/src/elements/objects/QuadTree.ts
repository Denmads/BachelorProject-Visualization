import Rect from "./Rect";
import RenderItem from "./RenderItem";
import Vector2 from "./Vector2";

type QuadItem = {
    origin: number,
    item: RenderItem
}

class QuadTree {
    static Children = {
        TOP_LEFT: 0,
        TOP_RIGHT: 1,
        BOTTOM_LEFT: 2,
        BOTTOM_RIGHT: 3
    }

    static ItemOrigin = {
        TOP_LEFT: 0,
        TOP_RIGHT: 1,
        BOTTOM_LEFT: 2,
        BOTTOM_RIGHT: 3
    }

    static MaxDepth: number = 7;

    boundingBox: Rect

    children: QuadTree[] = []
    items: QuadItem[] = []

    itemThreshold: number
    depth: number;

    constructor(boundingBox: Rect, threshold: number, currentDepth: number = 0) {
        this.boundingBox = boundingBox;
        this.itemThreshold = threshold
        this.depth = currentDepth;
    }

    addItem(item: RenderItem, itemOrigin: number = QuadTree.ItemOrigin.TOP_LEFT) {
        if (this._isLeafNode()) {
            this.items.push({
                origin: itemOrigin,
                item: item
            });

            if (this.items.length > this.itemThreshold && this.depth < QuadTree.MaxDepth) {
                this._createChildren();
                
                for (let i: number = 0; i < this.items.length; i++) {
                    for (let j: number = 0; j < this.children.length; j++) {
                        if (this.children[j].boundingBox.containsPoint(this._getItemOrigin(this.items[i].item, this.items[i].origin))) {
                            this.children[j].addItem(this.items[i].item, this.items[i].origin);
                            break;
                        }
                    }
                }

                this.items = [];
            }
        }
        else {
            for (let i: number = 0; i < this.children.length; i++) {
                if (this.children[i].boundingBox.containsPoint(this._getItemOrigin(item, itemOrigin))) {
                    this.children[i].addItem(item, itemOrigin);
                }
            }
        }

        
    }

    getCount(): number {
        if (this._isLeafNode()) {
            return this.items.length;
        }
        else {
            let sum = 0;
            for (let i: number = 0; i < this.children.length; i++) {
                sum += this.children[i].getCount();
            }
            return sum;
        }
    }

    getItemsInRect(rect: Rect): RenderItem[] {
        let returns = [];

        if (this._isLeafNode()) {
            for (let item of this.items) {
                if (rect.collides(item.item.boundingBox))
                    returns.push(item.item);
            }
        }
        else {
            for (let i: number = 0; i < this.children.length; i++) {
                if (this.children[i].boundingBox.collides(rect))
                    returns.push(...this.children[i].getItemsInRect(rect));
            }
        }

        let distincts: RenderItem[] = [];
        for (let item of returns) {
            if (distincts.findIndex((value: RenderItem) => value.id == item.id) == -1) {
                distincts.push(item);
            }
        }

        return distincts;
    }

    getItemsContainingPoint(point: Vector2) : RenderItem[] {
        let returns = [];
        console.log("POINTS");

        if (this._isLeafNode()) {
            console.log("LEAF");
            for (let item of this.items) {
                console.log(point, " inside ", item.item.boundingBox);
                if (item.item.boundingBox.containsPoint(point)) {
                    returns.push(item.item);
                    console.log("Point inside");
                }
            }
        }
        else {
            console.log("CHECK CHILDREN");
            console.log(this.children.length);
            for (let i: number = 0; i < this.children.length; i++) {
                if (this.children[i].boundingBox.containsPoint(point))
                    returns.push(...this.children[i].getItemsContainingPoint(point));
            }
        }

        let distincts: RenderItem[] = [];
        for (let item of returns) {
            if (distincts.findIndex((value: RenderItem) => value.id == item.id) == -1) {
                distincts.push(item);
            }
        }

        return distincts;
    }

    _getItemOrigin(item: RenderItem, itemOrigin: number): Vector2 {
        if (itemOrigin == QuadTree.ItemOrigin.TOP_LEFT) {
            return item.boundingBox.topLeftPoint();
        }
        else if (itemOrigin == QuadTree.ItemOrigin.TOP_RIGHT) {
            return item.boundingBox.topRightPoint();
        }
        else if (itemOrigin == QuadTree.ItemOrigin.BOTTOM_LEFT) {
            return item.boundingBox.bottomLeftPoint();
        }
        else if (itemOrigin == QuadTree.ItemOrigin.BOTTOM_RIGHT) {
            return item.boundingBox.bottomRightPoint();
        }
        else {
            return new Vector2();
        }
    } 

    _isLeafNode() {
        return this.children.length == 0;
    }

    _createChildren() {
        let child_size = new Vector2(this.boundingBox.size.x/2, this.boundingBox.size.y/2);

        this.children.push(new QuadTree(new Rect(this.boundingBox.position, child_size), this.itemThreshold, this.depth+1));
        this.children.push(new QuadTree(new Rect(new Vector2(this.boundingBox.position.x + this.boundingBox.size.x/2, this.boundingBox.position.y), child_size), this.itemThreshold, this.depth+1));
        this.children.push(new QuadTree(new Rect(new Vector2(this.boundingBox.position.x, this.boundingBox.position.y + this.boundingBox.size.y/2), child_size), this.itemThreshold, this.depth+1));
        this.children.push(new QuadTree(new Rect(new Vector2(this.boundingBox.position.x + this.boundingBox.size.x/2, this.boundingBox.position.y + this.boundingBox.size.y/2), child_size), this.itemThreshold, this.depth+1));
    }

    RENDER(context: CanvasRenderingContext2D) {
        if (this._isLeafNode()) {
            context.strokeRect(this.boundingBox.position.x, this.boundingBox.position.y, this.boundingBox.size.x, this.boundingBox.size.y);
        }
        else {
            for (let i: number = 0; i < this.children.length; i++) {
                this.children[i].RENDER(context);  
            }
        }
    }
}

export default QuadTree