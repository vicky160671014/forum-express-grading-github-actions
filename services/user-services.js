const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db
const { localFileHandler } = require('../helpers/file-helpers')

const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')// 密碼設定再確認

    User.findOne({ where: { email: req.body.email } })// 確認帳號是否存在
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(newUser => cb(null, { user: newUser }))
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: Restaurant },
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        user = user.toJSON()

        // 保留原始資料，提取並命名需要的資料，對敏感資料password作處理
        const isSelf = Number(req.user.id) === Number(user.id)
        const userProfile = [{ id: user.id, name: user.name, email: user.email, image: user.image, isAdmin: user.isAdmin }]
        const commentData = user.Comments ? user.Comments : []
        const favoritedRestaurantsData = user.FavoritedRestaurants ? user.FavoritedRestaurants : []
        const followingsUserData = user.Followings
          ? user.Followings.map(userFollowing => ({
            ...userFollowing,
            password: '********'
          }))
          : []
        const followersUserData = user.Followers
          ? user.Followers.map(userFollower => ({
            ...userFollower,
            password: '********'
          }))
          : []
        return cb(null, { isSelf, userProfile, commentData, favoritedRestaurantsData, followingsUserData, followersUserData })
      })
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    const { name } = req.body
    const { file } = req
    if (!name) throw new Error('Restaurant name is required!')
    if (req.user.id !== Number(req.params.id)) throw new Error('錯誤，僅能更改自己的資料')
    return Promise.all([
      User.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("Restaurant didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(updatedUser => cb(null, { user: updatedUser }))
      .catch(err => cb(err))
  },
  getTopUsers: (req, cb) => {
    // 撈出所有User與followers資料
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        // 整理 users 資料，把每個 user 項目都拿出來處理一次，並把新陣列儲存在 users 裡
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return cb(null, { users: result })
      })
      .catch(err => cb(err))
  },
  addFavorite: (req, cb) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')

        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(newFavorite => cb(null, { newFavorite }))
      .catch(err => cb(err))
  },
  removeFavorite: (req, cb) => {
    const { restaurantId } = req.params
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")

        return favorite.destroy()
      })
      .then(removedFavorite => cb(null, { removedFavorite }))
      .catch(err => cb(err))
  },
  addLike: (req, cb) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (like) throw new Error('You have liked this restaurant!')

        return Like.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(newLike => cb(null, { newLike }))
      .catch(err => cb(err))
  },
  removeLike: (req, cb) => {
    const { restaurantId } = req.params
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    }).then(like => {
      if (!like) throw new Error("You haven't liked this restaurant")

      return like.destroy()
    })
      .then(removedLike => cb(null, { removedLike }))
      .catch(err => cb(err))
  },
  addFollowing: (req, cb) => {
    const { userId } = req.params
    Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(newFollowing => cb(null, { newFollowing }))
      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(removeFollowing => cb(null, { removeFollowing }))
      .catch(err => cb(err))
  }
}

module.exports = userServices
