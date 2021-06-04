const express = require('express')
const Categoria = require('../model/Categoria')
const router = express.Router()
const { check, validationResult } = require('express-validator')

/*******************
 Lista todas as categorias
 get /categorias
 *******************/

router.get('/', async (req, res) => {
    try {
        const categorias = await Categoria.find({ 'status': 'ativo' })
            .sort({ nome: 1 })
        res.json(categorias)
    } catch (err) {
        res.status(500).send({
            errors: [{ message: "Não foi possivel obter as categorias" }]
        })
    }
})

/*******************
 Lista uma categoria pelo nome
 get /categorias/:nome
 *******************/

 router.get('/:nome', async (req, res) => {
    try {
        /**Não funciona */
        const categorias = await Categoria.find({nome: req.params.nome})
        res.json(categorias)
    } catch (err) {
        res.status(500).send({
            errors: [{ message: `Não foi possivel obter a categoria com o nome ${req.params.nome}` }]
        })
    }
})

/*******************
 * incluir uma nova categoria
 Post/categorias/
 *******************/
//constante para validar a categoria
const validaCategoria = [
    check('nome', 'Nome da categoria é obrigatório').not().isEmpty(),
    check('status', 'Informe um status valido para a categoria').isIn(['ativo', 'inativo'])
]
router.post('/', async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    //verifica se a categoria existe
    const { nome } = req.body
    let categoria = await Categoria.findOne({ nome })
    if (categoria) {
        return res.status(200).json({
            errors: [{ message: `Categoria já existe` }]
        })
    }
    try {
        let categoria = new Categoria(req.body)
        await categoria.save()
        res.send(categoria)
    } catch (err) {
        return res.status(500).json({
            errors: [{ message: `Erro ao salvar a categoria:${err.message}` }]
        })
    }
})

/*********
 * DELETE /categorias/:nome
 * apaga a categoria pelo nome
 *********/

router.delete('/:nome', async (req, res) => {

    await Categoria.findOneAndDelete(req.params.nome)
        .then(categoria => {
            res.send(
                { message: `Categoria ${categoria.nome} removida com sucesso` }
            )
        }).catch(err => {
            return res.status(500).send(
                {
                    errors: [{ message: `Não foi possivel apagar a categoria com o id ${req.params.id}` }]
                }
            )
        })
})

/*********
 * PUT /categorias
 * altera os dados da categoria informada
 **********/
router.put('/', validaCategoria,
    async (req, res) => {
        //verifica se existe algum erro
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        let dados = req.body
        await Categoria.findByIdAndUpdate(req.body._id, {
            $set: dados
        }, { new: true })
            .then(categoria => {
                res.send({ message: `Categoria ${categoria.nome} alterado com sucesso!` })
            }).catch(err => {
                return res.status(500).send({
                    errors: [{
                        message: `Não foi possivel alterar a categoria com o id ${req.body._id}`
                    }]
                })
            })
    }
)

module.exports = router
