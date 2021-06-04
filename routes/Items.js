const express = require('express')
const router = express.Router()
const Item = require('../model/Item')
const { check, validationResult } = require('express-validator')

/*******************
 Lista todos os item
 get - /items
 *******************/

router.get('/', async (req, res) => {
    try {
        const Items = await Item.find({ 'status': 'disponivel' })
            .sort({ nome: 1 })
        res.json(Items)
    } catch (err) {
        return res.status(500).json({
            errors: [{ message: `Erro ao listar os items:${err.message}` }]
        })
    }
})

/********
 * Lista os item pelo nome
 * GET - /items/:nome
 */
router.get('/:nome', async (req, res) => {
    /**Não funciona */
    try {
        const item = await Item.find({nome: req.params.nome})
        res.json(item)
    } catch (erro){
        res.status(500).send({
            errors: [{ message: `Item ${req.params.nome} não foi encontrado` }]
        })
    }
})

/*******************
 * incluir um novo item
 Post - /items/
 *******************/
//valida o item
const validaItem = [
    check('nome', 'Nome do item é obrigatório').not().isEmpty(),
    check('status', 'Informe um status valido').isIn(['disponivel', 'indisponivel']),
    check('categoria','Categoria não pode ser vazia').not().isEmpty(),
    check('categoria', 'Informe uma categoria valida').exists()

]
router.post('/', validaItem, async (req, res) => {
    //verifica erros
    const erros = validationResult(req)
    if (!erros.isEmpty()) {
        return res.status(400).json({
            errors: erros.array()
        })
    }

    try {
        let item = new Item(req.body)
        await item.save()
        res.send(item)
    } catch (err) {
        return res.status(500).json({
            errors: [{ message: `Erro ao salvar o item: ${err.message}` }]
        })
    }
})

/***********
 * deleta um item pelo id
 * DELETE - /items/:id
 ***********/

router.delete('/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id)
        .then(item => {
            res.send({
                message: `item ${item.nome} removido com sucesso`
            })
        }).catch(erro => {
            return res.status(500).send({
                errors: [{ message: `Não foi possivel apagar o item ${req.params.nome} com o id ${req.params.id}` }]
            })
        })
})

/**
 * altera um item
 * Put - /items
 */

router.put('/',validaItem,async(req,res)=>{
    const erros = validationResult(req)
    if(!erros.isEmpty()){
        return res.status(400).json({
            errors:erros.array()
        })
    }

    let dados = req.body
    await Item.findByIdAndUpdate(req.body._id,{
        $set: dados
    },{new:true})
    .then(item=>{
        res.send({message:`item ${item.nome} foi alterado!!`})
    })
    .catch(err=>{
        return res.status(500).send({
            errors:[{message:`Não foi possivel alterar o item ${res.params.nome}, id: ${res.params._id}`}]
        })
    })
})
module.exports = router