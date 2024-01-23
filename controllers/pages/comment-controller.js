const { Comment } = require('../../models')
const commentServices = require('../../services/comment-services')
const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'comment was successfully created')
      req.session.createdData = data
      return res.redirect(`/restaurants/${data.comment.restaurantId}`)
    })
  },
  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'comment was successfully deleted')
      req.session.deletedData = data
      res.redirect(`/restaurants/${data.comment.restaurantId}`) // restaurantId在data中
    })
    return Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error("Comment didn't exist!")
        return comment.destroy()
      })
      .then(deletedComment => res.redirect(`/restaurants/${deletedComment.restaurantId}`))
      .catch(err => next(err))
  }
}
module.exports = commentController
