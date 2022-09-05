const shortUUID = require('short-uuid')
const validator = require('email-validator')
const sequelize = require('sequelize')

const { Model } = sequelize

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }

  User.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          validEmail(value, next) {
            if (!validator.validate(value)) {
              return next('Please enter a valid email')
            }

            return next()
          },
        },
      },
      password: DataTypes.STRING,
      entries: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      }
    },
    {
      sequelize,
      modelName: 'User',
      // defaultScope: {
      //   attributes: { exclude: ['password'] },
      // },
    }
  )

  User.beforeCreate(user => {
    if (!user.id) user.id = shortUUID.generate()
  })

  return User
}
