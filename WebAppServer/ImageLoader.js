const fs = require('fs')
const fetch = require('node-fetch')
const util = require('util')
const sizeOf = require('image-size')
const path = './Images/'

exports.highResImage = async titleId => {
    let url = await highResImageUrl(titleId)
    if(url == "noImg"){
        return null
    }
    return getImageBuffer(url)
}

exports.listOfImageBuffersAndDimensions = async imgIds => {
    //imgIds = [{imgId: X, images:[titleId,titleId]},{},{}]
    //imgs = [[{url: X, width: Y, height: Z},{},{}],[{},{},{}],[{},{},{}]]
    let imgs = []

    for(let imageGroup of imgIds){
        let images = []
        for(let titleId of imageGroup.images){
            let imgInfo = await highResImageUrl(titleId, true)
            if(imgInfo != null){
                let data = await readImageFromCache(titleId)
                if(data != null){
                    imgInfo.buffer = data
                    imgInfo.downscaled = true
                    let dimensions = sizeOf(imgInfo.buffer)
                    imgInfo.width = dimensions.width
                    imgInfo.height = dimensions.height
                } else {
                    imgInfo.buffer = await getImageBuffer(imgInfo.url)
                    imgInfo.downscaled = false
                }
                images.push(imgInfo)
            } else {
                console.log("Image not found")
            }
        }
        imgs.push({imgId: imageGroup.imgId, images: images})
    }
    return imgs
}

async function highResImageUrl(titleId, dimensions = false){
    try {
        //(`https://sg.media-imdb.com/suggests/t/${titleId}.json`)
        let imdbObj = await getIMDBObj(titleId)
        if(!dimensions){
            return imdbObj.d[0].i[0]
        } else {
            return {url: imdbObj.d[0].i[0], width: imdbObj.d[0].i[1], height: imdbObj.d[0].i[2], id:titleId}
        }
    } catch (err){
        //console.log("Couldn't find image with id: " + titleId, err)
        return dimensions ? null : "noImg"
    }
}

async function readImageFromCache(titleId){
    try {
        let data = await fs.promises.readFile(path + titleId + '.jpg')
        console.log("Cache");
        return data
    } catch {
        console.log("No Cache");
        return null
    }
}

async function getImageBuffer(url){
    const response = await fetch(url)
    return await response.buffer()
}


async function getIMDBObj(id){
    let resp = await fetch(`https://sg.media-imdb.com/suggests/t/${id}.json`)
    let imdbStr = await resp.text()
    return JSON.parse(imdbStr.substring(id.length + 6, imdbStr.length - 1))
}