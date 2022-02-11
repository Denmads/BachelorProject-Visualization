import {ItemDescription} from "../elements/types"
import DataConnector from "../elements/interfaces/DataConnector";
import ItemProperties from "../elements/objects/ItemProperties";
import ImageState from "../elements/ImageState"
import Filter from "../elements/objects/Filter";
import { PropertyType } from "../elements/objects/PropertyType";
import LowResRequestQueue from "./LowResRequestQueue"
import StringListConstraint from "../elements/objects/constraints/StringListConstraint";
import { ConstraintType } from "../elements/ConstraintType";
import StringConstraint from "../elements/objects/constraints/StringConstraint";
import NumberConstraint from "../elements/objects/constraints/NumberConstraint";


let enumVals = ["Comedy", "Action", "Adventure", "Sci-Fi"]

export function getItemDescription(): ItemDescription {
    return {
        id: {
            displayName: "Id",
            valueType: PropertyType.STRING, 
            filter: false, 
            optional: false
        },  
        name: {
            displayName: "Name",
            valueType: PropertyType.STRING, 
            filter: false, 
            optional: false
        },
        genre: {
            displayName: "Genre",
            valueType: PropertyType.STRING_LIST,
            filter: true,
            optional: true,
            display: { unit: ""}
        },
        releaseYear: {
            displayName: "Release Year",
            valueType: PropertyType.INTEGER, 
            filter: true, 
            optional: false, 
            display: { unit: "Year"}
        },
        endYear: {
            displayName: "End Year",
            valueType: PropertyType.INTEGER, 
            filter: true, 
            optional: true, 
            display: { unit: "Year"}
        },
        runTime: {
            displayName: "Run Time",
            valueType: PropertyType.INTEGER, 
            filter: true, 
            optional: false, 
            display: { unit: "Minutes"}
        },
        titleType: {
            displayName: "Title Type",
            valueType: PropertyType.STRING,
            filter: true,
            optional: false,
            display: {unit: ""}
        },
        actors: {
            displayName: "Actors",
            valueType: PropertyType.STRING_LIST,
            filter: true,
            optional: true,
            display: {unit: ""}
        }
    }
}

export function compareItemProperties(item1: ItemProperties, item2: ItemProperties): boolean {
    return item1.getProperty("id") == item2.getProperty("id");
}

export function getDataConnectorInstance(): DataConnector {
    return new MovieDataConnector();
}

class MovieDataConnector implements DataConnector {
    fetchItems(filter: Filter): Promise<ItemProperties[]> {
        return new Promise(async (resolve, reject) => {
            let body: any = {}
            if (Object.keys(filter).length != 0) {
                body = this.createFilters(filter);
            }
            let jsonData = await fetch("http://localhost:8080/filteredTitles", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(data => data.json());
            let items: ItemProperties[] = [];
            for (let data of jsonData) {
                let info = new ItemProperties();
                info.setProperty("id", data.id);
                info.setProperty("name", data.primary_title);
                if (data.genres.length > 0) {
                    info.setProperty("genre", data.genres);
                }
                info.setProperty("releaseYear", data.start_year);
                if (data.end_year != 0) {
                    info.setProperty("endYear", data.end_year)
                }
                info.setProperty("runTime", data.runtime);
                info.setProperty("titleType", data.titletype);
                if (data.actors.length > 0) {
                    info.setProperty("actors", data.actors);
                }
                items.push(info);
            }
            resolve(items);
        });
    }

    private createFilters(filter: Filter): any {
        let body: any = {};

        if ("genre" in filter) {
            body.genres = [];

            for (let constraint of filter["genre"]) {
                let listConstraint = constraint as StringListConstraint;
                if (listConstraint.type == ConstraintType.LIST_INCLUDES) {
                    body.genres.push(listConstraint.value);
                }
            }
        }

        if ("actors" in filter) {
            body.actors = [];

            for (let constraint of filter["actors"]) {
                let listConstraint = constraint as StringListConstraint;
                if (listConstraint.type == ConstraintType.LIST_INCLUDES) {
                    body.actors.push(listConstraint.value);
                }
            }
        }

        if ("titleType" in filter) {
            for (let constraint of filter["titleType"]) {
                let stringConstraint = constraint as StringConstraint;
                if (stringConstraint.type == ConstraintType.EQUALS) {
                    body.titletypeid = stringConstraint.value;
                }
            }
        }

        if ("runTime" in filter) {
            body.runtime = {}

            for (let constraint of filter["runTime"]) {
                let numberConstraint = constraint as NumberConstraint;
                if (numberConstraint.type == ConstraintType.EQUALS) {
                    body.runtime.in = numberConstraint.value;
                }
                else if (numberConstraint.type == ConstraintType.LESS_THAN) {
                    body.runtime.before = numberConstraint.value;
                }
                else if (numberConstraint.type == ConstraintType.GREATER_THAN) {
                    body.runtime.after = numberConstraint.value;
                }
                else if (numberConstraint.type == ConstraintType.LESS_THAN_OR_EQUALS) {
                    body.runtime.before = numberConstraint.value;
                    body.runtime.in = numberConstraint.value;
                }
                else if (numberConstraint.type == ConstraintType.GREATER_THAN_OR_EQUALS) {
                    body.runtime.after = numberConstraint.value;
                    body.runtime.in = numberConstraint.value;
                }
            }
        }

        if ("releaseYear" in filter) {
            body.start_year = {}

            for (let constraint of filter["releaseYear"]) {
                let numberConstraint = constraint as NumberConstraint;
                if (numberConstraint.type == ConstraintType.EQUALS) {
                    body.start_year.in = numberConstraint.value;
                }
                else if (numberConstraint.type == ConstraintType.LESS_THAN) {
                    body.start_year.before = numberConstraint.value;
                }
                else if (numberConstraint.type == ConstraintType.GREATER_THAN) {
                    body.start_year.after = numberConstraint.value;
                }
                else if (numberConstraint.type == ConstraintType.LESS_THAN_OR_EQUALS) {
                    body.start_year.before = numberConstraint.value;
                    body.start_year.in = numberConstraint.value;
                }
                else if (numberConstraint.type == ConstraintType.GREATER_THAN_OR_EQUALS) {
                    body.start_year.after = numberConstraint.value;
                    body.start_year.in = numberConstraint.value;
                }
            }
        }

        if ("endYear" in filter) {
            body.end_year = {}

            for (let constraint of filter["endYear"]) {
                let numberConstraint = constraint as NumberConstraint;
                if (numberConstraint.type == ConstraintType.EQUALS) {
                    body.end_year.in = numberConstraint.value;
                }
                else if (numberConstraint.type == ConstraintType.LESS_THAN) {
                    body.end_year.before = numberConstraint.value;
                }
                else if (numberConstraint.type == ConstraintType.GREATER_THAN) {
                    body.end_year.after = numberConstraint.value;
                }
                else if (numberConstraint.type == ConstraintType.LESS_THAN_OR_EQUALS) {
                    body.end_year.before = numberConstraint.value;
                    body.end_year.in = numberConstraint.value;
                }
                else if (numberConstraint.type == ConstraintType.GREATER_THAN_OR_EQUALS) {
                    body.end_year.after = numberConstraint.value;
                    body.end_year.in = numberConstraint.value;
                }
            }
        }

        return body;  
    }


    fetchImage(item: ItemProperties, state: ImageState, lastImage: boolean): Promise<{image: HTMLImageElement, state: ImageState}> {
        return state == ImageState.LOW_RES ? this.fetchLowRes(item, lastImage) : this.fetchHighRes(item);
    }

    lowResImgToFetch: {itemId: string, resolve: (value: {image: HTMLImageElement, state: ImageState} | PromiseLike<{image: HTMLImageElement, state: ImageState}>) => void}[] = []
    requestQueue: LowResRequestQueue = new LowResRequestQueue();

    fetchLowRes(item: ItemProperties, lastItem: boolean): Promise<{image: HTMLImageElement, state: ImageState}> {
        return new Promise( async (resolve, reject) => {
            this.lowResImgToFetch.push({
                itemId: item.getProperty("id") as string,
                resolve
            })

            if (lastItem || this.lowResImgToFetch.length == 9) {
                this.requestQueue.queue(this.lowResImgToFetch);
                this.lowResImgToFetch = []
            }
        });
    }

    fetchHighRes(item: ItemProperties): Promise<{image: HTMLImageElement, state: ImageState}> {
        return new Promise( async (resolve, reject) => {
            let body = {
                titleId: item.getProperty("id")
            }
            let blob = await fetch("http://localhost:8080/picture/highres", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(data => data.blob());

            let img = new Image();
            img.onload = e => resolve({image: img, state: ImageState.HIGH_RES});
            img.src = URL.createObjectURL(blob);
        });
    }
}


