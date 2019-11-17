const Article = require('../models/article')
const Error500 = require('../errors/error500')
const Error404 = require('../errors/error404')

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body
  const owner = req.user._id

  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.send(article))
    .catch((err) => next(new Error500(`Ошибка при создании статьи -- ${err.message}`)))
}

module.exports.getAllArticles = (req, res, next) => {
  Article.find({})
    .populate('owner')
    .then((articles) => res.send(articles))
    .catch(() => next(new Error500('Ошибка при чтении всех статей')))
}

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id).select('+owner')
    // eslint-disable-next-line consistent-return
    .then((article) => {
      if (article === null) throw new Error404('Такой статьи нет')
      if (JSON.stringify(article.owner) !== JSON.stringify(req.user._id)) {
        const notArticleOwner = new Error('Статья не ваша, удалить нельзя')
        notArticleOwner.statusCode = 403
        throw notArticleOwner
      }
      Article.deleteOne(article)
        .then(() => res.send(article))
        .catch(() => { throw new Error500('Ошибка при удалении статьи') })
    })
    .catch((err) => next(err.statusCode ? err : new Error404('Такой статьи нет')))
}
