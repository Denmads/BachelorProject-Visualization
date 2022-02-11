const { response } = require('express')
const dao = require('./DataAccessObject')
const imgLoader = require('./ImageLoader')
const imgMerger = require('./ImageMerger')

exports.getFilteredTitles = async (params, response) => {
    let images
    if(Object.keys(params).length === 0 && params.constructor === Object){
        //No params sent
        images = await dao.getAllImages()
    } else {
        images = await dao.handleParams(params)
    }
    if(images.length > 0){
        response.writeHead(200, {'Content-Type':'application/json'})
        response.write(JSON.stringify(images))
    } else {
        response.writeHead(404)
    }
    return response
}

//Returns response containing list of merged images
exports.getLowResMergedImgs = async (titlesLists, response) => {
    //mergedImgs = [{"mergedImgId":id, "mergedImg":img},{"mergedImgId":id, "mergedImg":img}]    
    //imgInfos = [{imgId: 1, images: [{url, width, height, buffer}, {url, width, height, buffer}]},[]]
    try {
        let imgInfos = await imgLoader.listOfImageBuffersAndDimensions(titlesLists.data)
        let mergedImgInfo = {}
        for(let imgInfo of imgInfos){
            if(imgInfo.images.length == 0){
                mergedImgInfo[imgInfo.imgId] = {buffer:undefined, info: {}}
                continue
            }
            let mergedImg = await imgMerger.mergeImages(imgInfo.images)
            mergedImgInfo[imgInfo.imgId] = {buffer:Buffer.from(mergedImg.buffer).toString("base64"), info: mergedImg.info} 
        }
        response.writeHead(200, {'Content-Type':'application/json'})
        response.write(JSON.stringify(mergedImgInfo))
        return response
    } catch(err) {
        //console.log(err, "No images returned")
        response.writeHead(404)
        return response
    }
}

//Returns response containing url for single image poster
exports.getHighResImg = async (titleId, response) => {
    let imgBuffer = await imgLoader.highResImage(titleId)
    if(imgBuffer == null){
        response.writeHead(404)
    } else {
        response.writeHead(200, {'content-Type':'text/html'})
        response.write(imgBuffer)
    }
    return response
}


