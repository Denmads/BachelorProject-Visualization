const express = require('express')
const app = express()
const resGen = require('./ResponseGenerator')
const cors = require('cors')
const seaport = require('seaport')
let ports = seaport.connect('localhost', 9090)

app.use(express.json())
app.use(cors())

app.post('/picture/lowres', (req, res) => {
    resGen.getLowResMergedImgs(req.body,res).then(res => {
        res.send()
        console.log("Listening... again")
    })  
})

app.post('/picture/highres', (req,res) => {
    let jsonObj = req.body
    let titleId = jsonObj.titleId
    Promise.resolve(resGen.getHighResImg(titleId, res)).then(() => {
        res.send()
        console.log("Listening... again")
    })  
})

app.post('/filteredTitles', (req, res) => {
    let jsonObj = req.body
    console.log("Server received body:",jsonObj)
    resGen.getFilteredTitles(jsonObj, res).then(res => {
        res.send()
        console.log("Listening... again")
    })
})

app.listen(ports.register('TitlesServer'), () => console.log("Listening..."))