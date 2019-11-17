const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validate = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator: (v) => !v.match(/[^a-zA-Zа-яА-Я\s-.?,!]/),
      message: (props) => `${props.value} is not a valid Name for User!`,
    },
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validate.isEmail(v),
      message: 'Wrong email format',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
    validate: {
      validator: (v) => !v.match(/\s/),
      message: (props) => `${props.value} Password can not contains spaces`,
    },
  },
})

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'))
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'))
          }

          return user
        })
    })
}

module.exports = mongoose.model('user', userSchema)
