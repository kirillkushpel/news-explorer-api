const mongoose = require('mongoose')
const validate = require('validator')

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    minlength: 1,
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
  },
  text: {
    type: String,
    required: true,
    minlength: 1,
  },
  date: {
    type: String,
    required: true,
    minlength: 1,
  },
  source: {
    type: String,
    required: true,
    minlength: 1,
  },
  link: {
    type: String,
    required: true,
    minlength: 1,
    validate: {
      validator: (v) => validate.isURL(v),
      message: 'Wrong URL format',
    },
  },
  image: {
    type: String,
    required: true,
    minlength: 1,
    validate: {
      validator: (v) => validate.isURL(v),
      message: 'Wrong URL format',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
})

module.exports = mongoose.model('article', articleSchema)
