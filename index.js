const express = require('express')
//requisição das rotas
const rotaCategorias = require('./routes/Categorias')
const rotaItems = require('./routes/Items')
//Carrega as variaveis de ambiente
require('dotenv').config()
const InicializaMongoServer = require('./config/db')

InicializaMongoServer()//inicializa mongodb
const app = express()

const PORT=process.env.PORT

app.disable('x-power-by')
//Backend fara parse do json
app.use(express.json())

//rotas
app.use('/categorias', rotaCategorias)
app.use('/items', rotaItems)

app.get('/',(req,res)=>{
    res.json({
        mensagem:"API funcional"
    })
})

//rota de tratamento de erros
app.use(function(req, res){
    res.status(404).json({
        mensagem:`A rota ${req.originalUrl} não existe!`
    })
})

app.listen(PORT,(req,res)=>{
    console.log(`API funcionando na porta ${PORT}`)
})