const dao = require('./DataAccessObject')
const fs = require('fs')
const imageLoader = require('./ImageLoader')
const imageMerger = require('./ImageMerger')
const sizeOf = require('image-size')

DownloadAllImages()

async function DownloadAllImages(){
    //Specify where to start download from
    //let temp = await dao.getAllImageIDs()
    //let imgIDs = temp.splice(temp.indexOf("tt10260534"))

    //Just download all
    let imgIDs = await dao.getAllImageIDs()

    for(let imgID of imgIDs){
        let buffer = await imageLoader.highResImage(imgID)
        if(buffer != null){
            let dimensions = sizeOf(buffer)
            try {
                let downscaledImgBuffer = await imageMerger.downScaleImg(buffer,dimensions)
                downloadImage(imgID, downscaledImgBuffer)
            } catch (err) {
                console.log(`Couldn't downscale: ${imgID} due to error:`, err)
            }
        }
    }
}

function downloadImage(titleId, buffer) {
    try {
        fs.writeFile(`./Images/${titleId}.jpg`, buffer, () => {
            console.log("Downloaded image with id: " + titleId)
        })
    } catch (err) {
        console.log("Didn't download due to:", err)
    }
}