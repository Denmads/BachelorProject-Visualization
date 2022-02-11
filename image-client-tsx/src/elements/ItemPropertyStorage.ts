import DataConnector from './interfaces/DataConnector';
import ItemProperties from './objects/ItemProperties';
import { getDataConnectorInstance, getItemDescription } from '../specific/specific';
import RenderItemStorage from './RenderItemStorage';
import Filter from './objects/Filter';
import Constraint from './objects/Constraint';

class ItemPropertyStorage {
    static connector: DataConnector
    static items: ItemProperties[] = []

    private static filter: Filter = {};

    static getFilter(): Filter {
        return this.filter;
    }

    static addConstraint(property: string, constraint: Constraint): void {
        if (!(property in getItemDescription())) {
            throw new Error("Adding constraint for non existing property '" + property + "'");
        }

        if (!this.filter[property]) {
            this.filter[property] = [];
        }

        this.filter[property].push(constraint);
    }

    static clearFilter(): void {
        this.filter = {}
    }

    static initialize() {
        this.connector = getDataConnectorInstance();
    }

    static updateItems() {
        this.connector.fetchItems(this.filter).then(items => {
            for (let item of items) {
                if (!item.isValidItem())
                    throw new Error("An item has some invalid properties");
            }

            this.items = items;
            RenderItemStorage.recreateQuadTree();
        });
    }

    static getItems() {
        return this.items;
    }
}

ItemPropertyStorage.initialize();

export default ItemPropertyStorage