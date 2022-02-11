const httpProxy = require('http-proxy')
const http = require('http')
const seaport = require('seaport')

let ports = seaport.connect('localhost', 9090)
let seaportServer = seaport.createServer()

seaportServer.listen(9090)

let proxy = httpProxy.createProxyServer({})
let i = 0
http.createServer((req,res) => {
    let addresses = ports.query('TitlesServer')
    if(!addresses.length) {
        res.writeHead(503, {'Content-Type':'text/plain'})
        res.end('Service unavailable')
        return
    }
    proxy.web(req, res, {target: "http://localhost:" + addresses[i].port})
    i = (i+1) % addresses.length
}).listen(8080)