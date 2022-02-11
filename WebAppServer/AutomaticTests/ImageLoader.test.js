const ImageLoader = require('../ImageLoader')
const fetch = require('node-fetch')

it('Assert that highResImage(titleId) returns proper buffer', async () => {
    let response = await fetch("https://m.media-amazon.com/images/M/MV5BMmVmODY1MzEtYTMwZC00MzNhLWFkNDMtZjAwM2EwODUxZTA5XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg")
    let compareBuffer = await response.buffer()
    await expect(ImageLoader.highResImage("tt0073195")).resolves.toEqual(compareBuffer)
})

it('Assert that listOfImageBuffersAndDimensions returns the proper buffers and extra info', async () => {
    let compareBuffer1 = await ImageLoader.highResImage("tt0088248")
    let compareBuffer2 = await ImageLoader.highResImage("tt0088247")
    await expect(ImageLoader.listOfImageBuffersAndDimensions([{imgId: 1, images:["tt0088248","tt0088247"]}])).resolves
    .toEqual([{imgId:1,
                        images:[{id: "tt0088248", buffer: compareBuffer1, downscaled: false, width: 1074, height:1500, url: "https://m.media-amazon.com/images/M/MV5BYjIxMjBjNGUtYmVkZi00ODFmLThlZTgtNzBmNWQyNjYyOWEwXkEyXkFqcGdeQXVyMzU0NzkwMDg@._V1_.jpg"},
                        {id:"tt0088247", buffer: compareBuffer2, downscaled: false, width: 1066, height:1600, url: "https://m.media-amazon.com/images/M/MV5BYTViNzMxZjEtZGEwNy00MDNiLWIzNGQtZDY2MjQ1OWViZjFmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"}]}])
})