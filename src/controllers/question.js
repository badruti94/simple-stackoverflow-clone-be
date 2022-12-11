const Joi = require('joi')
const { Op } = require('sequelize')
const { question, user, comment } = require('../../models')

exports.getAllQuestion = async (req, res) => {
    try {
        const { search } = req.query

        let data;
        if (search) {
            data = await question.findAll({
                where: {
                    description: {
                        [Op.like]: `%${search}%`
                    }
                },
                attributes: ['id', 'description']
            })
        } else {
            data = await question.findAll({
                attributes: ['id', 'description']
            })
        }

        data = data.map(question =>
        ({
            ...question.dataValues,
            description: question.dataValues.description.substring(0, 50)
        })
        )

        res.status(200).send({
            data: {
                question: data
            }
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

exports.createQuestion = async (req, res) => {
    const schema = Joi.object({
        language: Joi.string().required(),
        code: Joi.string().required(),
        description: Joi.string().required()
    })
    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(401).send({
            message: error.details[0].message
        })
    }

    try {
        await question.create({ ...req.body, user_id: req.userId })

        res.status(201).send({
            message: 'Question created successfully'
        })

    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

exports.getQuestion = async (req, res) => {
    try {
        const { id } = req.params

        const data = {}
        data.question = await question.findByPk(id, {
            include: {
                model: user,
                as: 'user',
                attributes: ['username']
            },
            attributes: ['id', 'language', 'code', 'description']
        })

        res.status(200).send({
            data
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params

        await question.destroy({
            where: {
                id
            }
        })

        res.status(200).send({
            message: 'Question deleted successfully'
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}