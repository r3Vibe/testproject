const app = require("./app")
const mongoose = require("mongoose")
const config = require("./config/config")

let server;
mongoose.connect(config.db.url).then(()=>{
    console.log("Database Connected...")
    server = app.listen(config.port,()=>{
        console.log(`Server Running On ${config.port}`)
    })
})


const exitHandler = ()=>{
    if(server){
        server.close(()=>{
            console.log("Server Closed")
            process.exit(1)
        })
    }else{
        process.exit(1)
    }
}


const errorHandler = (err)=>{
    console.log(err)
    exitHandler()
}


process.on("uncaughtException",errorHandler);
process.on("unhandledRejection",errorHandler);

process.on("SIGTERM",()=>{
    if(server){
        server.close();
    }
})