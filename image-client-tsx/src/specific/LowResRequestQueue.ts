import ImageState from "../elements/ImageState";
import ItemProperties from "../elements/objects/ItemProperties"

class LowResRequestQueue {
    requestQueue: {itemId: string, resolve: (value: {image: HTMLImageElement, state: ImageState} | PromiseLike<{image: HTMLImageElement, state: ImageState}>) => void}[][] = []
    ongoingRequests: number = 0;
    maxRequests: number = 20;

    queue(items: {itemId: string, resolve: (value: {image: HTMLImageElement, state: ImageState} | PromiseLike<{image: HTMLImageElement, state: ImageState}>) => void}[]) {
        this.requestQueue.push(items);

        new Promise<void>(async (resolve, reject) => {
            await this.checkForPendingRequests(resolve);
        });
    }

    private async checkForPendingRequests(resolveCheck: (value: void | PromiseLike<void>) => void) {
        if (this.requestQueue.length > 0 && this.ongoingRequests < this.maxRequests) {
            this.ongoingRequests++;
            let request = this.requestQueue.shift()!!;

            let body = {
                data: [
                    {
                        imgId: "img",
                        images: request.map(val => 
                            val.itemId
                        )
                    }
                ]
            }
            let data = await fetch("http://localhost:8080/picture/lowres", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(data => data.json());
            
            let blob = data["img"].buffer !== undefined ? this.b64toBlob(data["img"].buffer) : undefined;
            let info = data["img"].info;
    
            let img = new Image();
            img.onload = e => {
                let canvas: HTMLCanvasElement = document.createElement('canvas');
                canvas.height = img.height
                canvas.width = img.width
                let ctx = canvas.getContext("2d")
                ctx?.drawImage(img, 0, 0)
    
                
                let promises = []
                for (let item of request) {
                    promises.push(new Promise<void>((resolve, reject) => {
                        let specificCanvas: HTMLCanvasElement = document.createElement('canvas');
                        let specificCtx = specificCanvas.getContext("2d")!!;
                        if (!info[item.itemId]) {
                            specificCanvas.height = 100;
                            specificCanvas.width = 100;

                            specificCtx.fillStyle = "#515151";
                            specificCtx.fillRect(0 , 0, 100, 100);
                        }
                        else {
                            let itemInfo = info[item.itemId];
                            let imgData = ctx?.getImageData(itemInfo.X, itemInfo.Y, itemInfo.width, itemInfo.height)!!;
                            
                            specificCanvas.height = imgData.height
                            specificCanvas.width = imgData.width
                            specificCtx?.putImageData(imgData, 0, 0)
            
                        }
                        let specificImg = new Image();
                        specificImg.onload = e => {
                            item.resolve({image: specificImg, state: (!info[item.itemId] ? ImageState.NO_IMAGE : ImageState.LOW_RES)});
                            resolve();
                        }
                        specificImg.src = specificCanvas.toDataURL("image/png");
                    }));
                }

                Promise.all(promises).then(() => {
                    this.ongoingRequests--;
                    this.checkForPendingRequests(resolveCheck);
                })
            };
            img.src = blob === undefined ? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" : URL.createObjectURL(blob);
        }
        else {
            resolveCheck();
        }
    }

    private b64toBlob(b64Data: string, contentType='', sliceSize=512): Blob {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
      
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }
}

export default LowResRequestQueue