const express = require('express')
const router = express.Router()
const Item = require('../model/Item')
const { check, validationResult } = require('express-validator')

/*******************
 Lista todos os item
 get /item
 *******************/

router.get('/', async (req, res) => {
    try {
        const Items = await Item.find({ 'status': 'ativo' }).sort({ nome: 1 })
        res.json(Items)
    } catch (err) {
        return res.status(500).json({
            errors: [{ message: `Erro ao listar os items:${err.message}` }]
        })
    }
})

/*******************
 * incluir um novo restaurante
 Post/restaurante/
 *******************/
//valida o item
const validaItem = [
    check('nome', 'Nome do item é obrigatório').not().isEmpty(),
    check('status', 'Informe um status valido').isIn(['disponivel', 'indisponivel']),
    check('categoria', 'Informe uma categoria valida').exists()

]
router.post('/', validaItem, async (req, res) => {
    //verifica erros
    const erros = validationResult(req)
    if(!erros.isEmpty()){
        return res.status(400).json({
            errors: erros.array()
        })
    }

    try{
        let item = new Item(req.body)
        await item.save()
        res.send(item)
    }catch(err){
        return res.status(500).json({
            errors:[{message:`Erro ao salvar o item: ${err.message}`}]
        })
    }
})

module.exports = router