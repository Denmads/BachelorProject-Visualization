const sharp = require('sharp')
const fs = require('fs')
const { listOfImageBuffersAndDimensions } = require('./ImageLoader')

exports.mergeImages = async (imageInfo) => {
        let images = []
        let imageBuffer
        imageInfo.forEach(imageDetails => {
                //Conversion needed because Sharp needs url to be in input
                let img = {input : imageDetails.buffer, width: imageDetails.width, height: imageDetails.height, id:imageDetails.id, downscaled: imageDetails.downscaled}
                images.push(img)
        })
        let downScaledImgs = await downScaleImgs(images)
        let canvas = calculateCanvas(downScaledImgs)

        await Promise.all(images).then(async values => {
                await sharp({
                        create: canvas
                })
                .jpeg()
                .composite(downScaledImgs)
                //.toFile("out2.jpg")
                .toBuffer()
                .then(outputBuffer => {
                        imageBuffer = outputBuffer
                })
        })

        let mergedImg = {buffer: imageBuffer}
        let outputInfo = {}
        for(let img of downScaledImgs){
                outputInfo[img.id] = {width: img.width, height: img.height, X: img.left, Y: img.top}
        }
        mergedImg["info"] = outputInfo
        return mergedImg
}

exports.downScaleImg = async (image, dimensions) => {
        let imgInfo = await downScaleImgs([{input:image, width:dimensions.width, height:dimensions.height}])
        return imgInfo[0].input
}

async function downScaleImgs(images, scale = 10) {
        //Contain downscaled images
        let imgs = []
        await Promise.all(images.map(async img => {
                if(!img.downscaled) {
                        img.width = Math.floor(img.width/scale)
                        img.height = Math.floor(img.height/scale)
                        let imgBuffer = await sharp(img.input)
                        .resize(img.width, img.height)
                        .toBuffer()
                        img.input = imgBuffer
                }
                imgs.push(img)
        }))
        return imgs
}

//Algorithm for optimal placement of smaller rectangles insider larger rectangle
//Based on a simplification of the first steps of:
//https://www.codeproject.com/Articles/210979/Fast-optimizing-rectangle-packing-algorithm-for-bu
function calculateCanvas(downScaledImgs){
        try{
                let canvas = {channels: 3, background: {r: 0, g: 0, b: 0}}
                downScaledImgs.sort((a,b) => {return b.height - a.height})
                let firstImg = downScaledImgs[0]
                canvas.height = firstImg.height
                canvas.width = firstImg.width
                firstImg.left = 0
                firstImg.top = 0
                if(downScaledImgs.length == 1) {return canvas}
                scndImg = downScaledImgs[1]
                scndImg.left = firstImg.width
                scndImg.top = 0
                canvas.width += scndImg.width
                unusedSpaceBlocks = [{unusedX: firstImg.width, unusedY: scndImg.height}]
        
                for(let i = 2; i< downScaledImgs.length; i++){
                        let currImg = downScaledImgs[i]
                        let inserted = false
                        for(let j = 0; j< unusedSpaceBlocks.length; j++){
                                let currBlock = unusedSpaceBlocks[j]
                                //There is enough space under an image for this image
                                if(currImg.height <= canvas.height - currBlock.unusedY){
                                        //Insert image at empty space
                                        currImg.left = currBlock.unusedX
                                        currImg.top = currBlock.unusedY
                                        //Define new X and (old) Y for the unused block besides the inserted img
                                        unusedSpaceBlocks.splice(j+1,0,{unusedX: currBlock.unusedX + currImg.width, unusedY: currBlock.unusedY})
                                        //Define new Y for block underneath the inserted img
                                        currBlock.unusedY += currImg.height
                                        //Check if canvas should have larger width
                                        if(currImg.left + currImg.width > canvas.width){
                                                canvas.width = currImg.left + currImg.width
                                        }
                                        inserted = true
                                        break
                                }
                        }
                        //Image was too big to be inserted under any other
                        if(!inserted){
                                currImg.left = canvas.width
                                currImg.top = 0
                                canvas.width += currImg.width
                                unusedSpaceBlocks.push({unusedX: currImg.left, unusedY: currImg.height})
                        }
                }
                return canvas
        } catch(err){
                console.log(err)
        }
}