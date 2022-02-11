const ImageMerger = require('../ImageMerger')
const ImageLoader = require('../ImageLoader')

it('Assert that the mergeImages(imageInfo) does result in an actual answer', async () => {
    let compareBuffer1 = await ImageLoader.highResImage("tt0088248")
    let compareBuffer2 = await ImageLoader.highResImage("tt0088247")
    await expect(ImageMerger.mergeImages([{id: "tt0088248", buffer: compareBuffer1, width: 1074, height:1500, url: "https://m.media-amazon.com/images/M/MV5BYjIxMjBjNGUtYmVkZi00ODFmLThlZTgtNzBmNWQyNjYyOWEwXkEyXkFqcGdeQXVyMzU0NzkwMDg@._V1_.jpg"},
    {id:"tt0088247", buffer: compareBuffer2, width: 1066, height:1600, url: "https://m.media-amazon.com/images/M/MV5BYTViNzMxZjEtZGEwNy00MDNiLWIzNGQtZDY2MjQ1OWViZjFmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"}])).toBeDefined()
})

it('Assert that downScaleImg(image) returns a buffer that is smaller than the original', async () => {
    let compareBuffer = await ImageLoader.highResImage("tt0088248")
    let smallerBuffer = await ImageMerger.downScaleImg(compareBuffer, {width:1074,height:1500})
    expect(smallerBuffer.length).toBeLessThan(compareBuffer.length)
})