const Joi = require('joi')
const { comment, user } = require('../../models')

exports.createComment = async (req, res) => {
    const schema = Joi.object({
        comment: Joi.string().required(),
    })
    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(401).send({
            message: error.details[0].message
        })
    }

    try {
        await comment.create({
            comment: req.body.comment,
            user_id: req.userId,
            question_id: req.params.id
        })

        res.status(201).send({
            message: 'Comment created successfully'
        })

    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

exports.getComments = async (req, res) => {
    try {
        const data = {}
        data.comments = await comment.findAll({
            where: {
                question_id: req.params.id
            },
            include: {
                model: user,
                as: 'user',
                attributes: ['username']
            },
            attributes: ['id', 'comment', 'solve'],
            order: [['createdAt', 'ASC']]
        })

        let isSolve = await comment.findAll({
            where: {
                question_id: req.params.id,
                solve: true
            }
        })
        data.isSolve = isSolve.length > 0

        res.status(200).send({
            data
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
        })
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params

        await comment.destroy({
            where: {
                id
            }
        })

        res.status(201).send({
            message: 'Comment deleted successfully'
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
        })
    }
}

exports.solveQuestion = async (req, res) => {
    try {
        const { id } = req.params

        await comment.update({
            solve: true,
        }, {
            where: {
                id
            }
        })

        res.status(201).send({
            message: 'success'
        })
    } catch (error) {
        res.status(500).send({
            // message: "Internal Server Error",
            msg: error.message
        })
    }
}