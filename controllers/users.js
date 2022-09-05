const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const models = require('../models')
const user = require('../models/user')

const checkAvailability = async (req, res, next) => {
  const { email = '' } = req.body

  const user = await models.User.findOne({
    where: { email },
  })

  if (user) {
    return next({
      status: 400,
      message: 'This email address is already in use',
    })
  }

  res.send([])
}

const createUser = async (req, res) => {
  const { body } = req
  const { email, name, password } = body

  const SALT = 10

  const hash = await bcrypt.hash(password, SALT)

  if (hash) {
    const { id, entries } = await models.User.create({
      name,
      email,
      password: hash,
    })

    const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET)

    res.send({ id, name, entries, token })
  }
}

const authorizeUser = async (req, res, next) => {
  const { body } = req
  const { email, password } = body

  const user = await models.User.findOne({
    where: { email },
  })

  if (!user) {
    return res.status(400).send({
      error: 'Email or password is incorrect',
    })
  }

  const result = await bcrypt.compare(password, user.password)

  if (result) {
    const { id, name, entries } = user
    const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET)
    res.send({ id, name, entries, token })
  } else {
    return res.status(400).send({
      error: 'Email or password is incorrect',
    })
  }
}

const authenticateUser = async (req, res, next) => {
  const { params } = req
  const { userId } = params

  const token = req.headers.authorization.split(' ')[1]

  await jwt.verify(token, process.env.TOKEN_SECRET, err => {
    if (err) {
      return res.status(401).send({
        error: 'Not authorized',
      })
    }
  })

  const user = await models.User.findOne({
    attributes: ['id', 'name', 'email', 'entries', 'createdAt'],
    where: { id: userId },
  })

  if (!user) {
    return res.send(401).send({
      error: 'Not authorized',
    })
  }

  res.locals.user = user

  next()
}

const getUser = (req, res) => {
  return res.send(res.locals.user)
}

const updateUser = async (req, res) =>
  models.sequelize.transaction(async transaction => {
    const { user } = res.locals

    user.entries += 1

    await user.save({ transaction })

    return res.send(user)
  })

module.exports = {
  checkAvailability,
  createUser,
  authorizeUser,
  authenticateUser,
  getUser,
  updateUser,
}
