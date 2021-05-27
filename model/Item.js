const mongoose = require('mongoose')

const ItemSchema = mongoose.Schema({
    nome: {
        type: String
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId, ref:'Categorias'
    },
    quantidade: {
        type: Number
    },
    status: {
        type: String,
        enum: ['disponivel', 'indisponivel'],
        default: 'indisponivel'
    },
    foto: {
        originalname: { type: String },
        path: { type: String },
        size: { type: Number },
        mimeType: { type: String }
    },
    nota:{
        type:Number
    },
    preco:{
        type:Number
    }
}, { timestamps: true })

module.exports = mongoose.model('Item', ItemSchema)