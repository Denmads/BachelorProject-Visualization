const mysql = require('mysql')
const util = require('util')

let imageLimit = 100
let titleIdLimit = 50000

exports.imageLimit = imageLimit
exports.titleIdLimit = titleIdLimit

let allTitlesAndTypes = `SELECT titles.id, titles.primary_title, titles.start_year, titles.end_year, titles.runtime, titletype.name AS titletype FROM titles JOIN titletype ON titles.titletypeid = titletype.id LIMIT ${imageLimit}`
let allGenresFromID = `SELECT genres.titleid, genre.name FROM (SELECT titles.id AS titleid, title_genre_relation.genreid AS genreid FROM title_genre_relation JOIN titles ON title_genre_relation.titleid = titles.id WHERE titles.id=?) AS genres JOIN genre ON genres.genreid = genre.id`
let allActorsFromID = `SELECT actorlist.titleid, actors.name FROM (SELECT titles.id AS titleid, title_actor_relation.actorid AS actorid FROM title_actor_relation JOIN titles ON title_actor_relation.titleid = titles.id WHERE titles.id=?) AS actorlist JOIN actors ON actorlist.actorid = actors.id`
let allTitleIDs = `SELECT id FROM titles LIMIT ${titleIdLimit}`
let otherProps = `SELECT titles.id FROM titles WHERE`

//let idsFromGenre = `SELECT title_genre_relation.titleid FROM (title_genre_relation INNER JOIN genre ON title_genre_relation.genreid = genre.id) WHERE name = ?`
//let idsFromActor = `SELECT title_actor_relation.titleid, actors.name FROM (title_actor_relation INNER JOIN actors ON title_actor_relation.actorid = actors.id) WHERE name = ?`
let actorIdFromActor = `SELECT id FROM actors WHERE name = ? AND birth_year > 0`
let genreIdFromGenre = `SELECT id FROM genre WHERE name = ?`

let titleInfoAndTypeFromID = `SELECT titles.primary_title, titles.start_year, titles.end_year, titles.runtime, titletype.name as titletype FROM titles JOIN titletype ON titles.titletypeid = titletype.id WHERE titles.id = ?`

let queries = {genres:[`title_genre_relation`,`genreid`], actors:[`title_actor_relation`,`actorid`], in:`=`, after:`>`,before:`<`}
let queryBuildArray = {actors: actorIdFromActor, genres: genreIdFromGenre}

function makeDB() {
    const connection = mysql.createConnection({
        host: "185.11.204.105",
        user: "qrrgxfgq_admin",
        password: "Støvsuger123",
        port: 3306,
        database: "qrrgxfgq_moviedata"
    })

    //Wrapper class that makes queries into promises
    return {
        query(sql, args){
            return util.promisify(connection.query).call(connection, sql, args)
        },
        queryPrepared(sql, params, args){
            return util.promisify(connection.query).call(connection, sql, params, args)
        },
        close(){
            return util.promisify(connection.end).call(connection)
        },
        escape(args) {
            return connection.escape.call(connection, args)
        }
    }
}

exports.getAllImages = async () => {
    const db = makeDB()
    console.log("Fetching image data")
    let imgInfoList = []
    try {
        let subqueries = []
        await new Promise((resolve)=>{
            db.query(allTitlesAndTypes, (err, results) => {
                if(err) throw err
                for(let res of results){
                    subqueries.push(new Promise((resolve) => {
                        db.queryPrepared(allGenresFromID, [res.id], (err, results) => {
                            if(err) throw err
                            res.genres = results.map((row) => row.name)
                            resolve()
                        })
                    }))
                    subqueries.push(new Promise((resolve) => {
                        db.queryPrepared(allActorsFromID, [res.id], (err, results) => {
                            if(err) throw err
                            res.actors = results.map((row) => row.name)
                            resolve()
                        })
                    }))
                    imgInfoList.push(res)
                }
                resolve()
            })
        })
        await Promise.all(subqueries)
    } catch {
        console.log("Error in fetching image data")
    } finally {
        await db.close()
        return imgInfoList
    }
}

exports.getAllImageIDs = async () => {
    const db = makeDB()
    let output = []
    try {
        let someRows = await db.query(allTitleIDs)
        output = someRows.map(res => res.id)  
    } catch {
        console.log("Error in fetching image ids")
    } finally {
        await db.close()
        return output
    }
}

exports.handleParams = async params => {
    const db = makeDB()
    let otherParam = false
    let subqueries = []
    let outputTitles = ["unused"]
    let query = otherProps
    let prepInput = []
    try {
        console.log("Fetching image IDs from parameters")
        for(let param in params){
            if(param == "genres" || param == "actors"){
                let ids = []
                let idQueries = []
                for(let elem in params[param]){
                    idQueries.push(new Promise((resolve)=> {
                        db.queryPrepared(queryBuildArray[param], [params[param][elem]], (err, results) => {
                            if (err) throw err
                            if(results.length > 0) ids.push(results[0].id)
                            resolve()
                        })
                    }))
                }
                await Promise.all(idQueries)
                let queryBuilder = `SELECT t1.titleid FROM ${queries[param][0]} t1`
                let queryBuilderEnd = ``
                if(ids.length > 1){
                    for(let i = 1; i < ids.length; i++){
                        queryBuilder += ` JOIN ${queries[param][0]} t${i+1} ON t1.titleid = t${i+1}.titleid`
                        queryBuilderEnd += ` AND t${i+1}.${queries[param][1]} = ?`
                    }
                }
                queryBuilder += ` WHERE t1.${queries[param][1]} = ?` + queryBuilderEnd
                if(ids.length > 0){
                    subqueries.push(new Promise((resolve) => {
                        db.queryPrepared(queryBuilder, ids, (err, results) => {
                            if(err) throw err
                            outputTitles = intersection(outputTitles, results.map(res => res.titleid))
                            resolve()
                        })
                    }))
                }
            } else if (param == "titletypeid" || param == "primary_title"){
                otherParam = true
                query += ` ${param} = ? AND`
                prepInput.push(params[param])
            } else if (param == "start_year" || param == "end_year"  || param == "runtime"){
                otherParam = true
                for (let key in params[param]){
                    if (isNaN(params[param][key])) {
                        otherParam = false
                        break
                    }
                    query += ` ${param} ${queries[key]} ? AND`
                    prepInput.push(params[param][key])
                }
            }
        }
        if(otherParam){
            query = query.substring(0, query.length - 4)
            subqueries.push(new Promise((resolve) => {
                db.queryPrepared(query, prepInput, (err, results) => {
                    if(err) throw err
                    outputTitles = intersection(outputTitles, results.map(res => res.id))
                    resolve()
                })
            }))
        }
        await Promise.all(subqueries)
    } catch {
        console.log("Error filtering ids")
    } finally {
        await db.close()
        let imgInfoList = await gatherInfo(outputTitles)
        return imgInfoList
    }
}

async function gatherInfo(idList) {
    const db = makeDB()
    if(idList.length > imageLimit) idList.length = imageLimit
    console.log("Gathering info about images")
    let subqueries = []
    let outputInfo = []
    for(let id of idList){
        let res = {"id":id}
        subqueries.push(new Promise((resolve) => {
            db.queryPrepared(titleInfoAndTypeFromID, [id], (err,results) => {
                if(err) throw err
                if(results.length > 0){
                    let result = results[0]
                    for(let property of Object.keys(result)){
                        res[property] = result[property]
                    }
                    outputInfo.push(res)
                }
                resolve()
            })
        }))
        subqueries.push(new Promise((resolve) => {
            db.queryPrepared(allActorsFromID, [id], (err, results) => {
                if(err) throw err
                res.actors = results.map((row) => row.name)
                resolve()
            })
        }))
        subqueries.push(new Promise((resolve) => {
            db.queryPrepared(allGenresFromID, [id], (err, results) => {
                if(err) throw err
                res.genres = results.map((row) => row.name)
                resolve()
            })
        }))
    }
    await Promise.all(subqueries)
    await db.close()
    return outputInfo
}

//return ar1.filter(value => ar2.includes(value))      80 s - Animation movies after 2015
function intersection(ar1, ar2) {
    if(ar1[0] === "unused") return ar2 //295 ms - Animation movies after 2015
    let tmp1 = {}
    let tmp2 = {}

    ar1.forEach(title => tmp1[title] = "")
    ar2.forEach(title => tmp2[title] = "")

    for(let title in tmp1){
        if(!(title in tmp2)){
            delete tmp1[title]
        }
    }
    return Object.keys(tmp1)
}