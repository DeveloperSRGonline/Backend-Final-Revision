const http = require('http') 
// isse toh hum ne install hai kiya (npm i http) toh kiya hi nahi
// http - module hai (jo nodejs ke saath aata hai vo)(built in packages)
// cat-me - packages hai (jo humne npm i karke install karte hai) third party library

const server = http.createServer((req,res)=>{
    res.end('Hello world from the server')
});// server create ho gaya hai.

// starting server
server.listen(3000,()=>{
    console.log('Server is running on port 3000')
})
