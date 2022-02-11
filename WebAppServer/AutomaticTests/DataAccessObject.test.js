const DAO = require('../DataAccessObject')
jest.setTimeout(120000)

it('Assert that handleParams returns right movies based on primary title', async () => {
    await expect(DAO.handleParams({primary_title:"Pulp Fiction"})).resolves.toEqual([{"id":"tt0110912","primary_title":"Pulp Fiction","start_year":1994,"end_year":0,"runtime":154,"titletype":"movie","actors":["John Travolta","Uma Thurman","Samuel L. Jackson","Bruce Willis"],"genres":["Crime"]}])
})
it('Assert that handleParams returns right movies based on primary title and start year', async () => {
    await expect(DAO.handleParams({primary_title:"Toy Story",start_year:{after:1994}})).resolves.toEqual([{"id":"tt0114709","primary_title":"Toy Story","start_year":1995,"end_year":0,"runtime":81,"titletype":"movie","actors":["Tom Hanks","Tim Allen","Don Rickles","Jim Varney"],"genres":["Adventure","Animation"]}])
})
it('Assert that handleParams returns right movies based on primary title and genres', async () => {
    await expect(DAO.handleParams({primary_title:"Inception",genres:["Adventure"]})).resolves.toEqual([{"id":"tt1375666","primary_title":"Inception","start_year":2010,"end_year":0,"runtime":148,"titletype":"movie","actors":["Leonardo DiCaprio","Joseph Gordon-Levitt","Elliot Page","Ken Watanabe"],"genres":["Action","Adventure"]}])
})

it('Assert that getAllImages returns the right amount of images', async () => {
    let list = await DAO.getAllImages()
    expect(list.length).toBe(DAO.imageLimit)
})

it('Assert that getAllImageIDs returns the right amount of image IDs', async () => {
    let list = await DAO.getAllImageIDs()
    expect(list.length).toBe(DAO.titleIdLimit)
})