import Filter from "../objects/Filter";
import ItemProperties from "../objects/ItemProperties";
import ImageState from "../ImageState"

interface DataConnector {
    fetchItems(filter: Filter): Promise<ItemProperties[]>;

    fetchImage(item: ItemProperties, state: ImageState, lastImage: boolean): Promise<{image: HTMLImageElement, state: ImageState}>;
}

export default DataConnector