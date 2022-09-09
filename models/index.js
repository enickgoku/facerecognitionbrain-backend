const allConfig = require('../config/config.json')
const Sequelize = require('sequelize')
const User = require('./user')

const env = process.env.NODE_ENV || 'development'
const config = allConfig[env]

const models = {
  User,
}

const db = {}

let sequelize

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    retry: {
      match: [
        Sequelize.ConnectionError,
        Sequelize.ConnectionTimedOutError,
        Sequelize.TimeoutError,
        /Deadlock/i,
      ],
      max: 3,
    },
  })
}

for (const name of Object.keys(models)) {
  db[name] = models[name](sequelize, Sequelize.DataTypes)
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
