const mongoose = require('mongoose')
//String de conexão com o mongodb
const MONGOURI = process.env.MONGODB_URL

const InicializaMongoServer = async()=>{
    try{
        await mongoose.connect(MONGOURI,{
            useNewUrlParser:true, //Forçamos a utilizar o ultimo parser de url
            useCreateIndex:true,//quando necessario utiliza a criação de indices
            useFindAndModify:false,//o padrão é encontrar os registros e alterar todos
            useUnifiedTopology:true//utilizaremos a engine para descoberta de servidores
        })
        console.log("Conectado ao MongoDB!!")
    }catch(e){
        console.log(e)
        throw e // explodira os detalhes
    }
}

module.exports = InicializaMongoServer