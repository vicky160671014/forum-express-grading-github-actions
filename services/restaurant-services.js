const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantServices = {
  getRestaurants: (req, cb) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || '' // 新增這裡，從網址上拿下來的參數是字串，先轉成 Number 再操作
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
        const LikedRestaurantId = req.user?.LikeRestaurants ? req.user.LikeRestaurants.map(lr => lr.id) : []
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description?.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: LikedRestaurantId.includes(r.id)
        }))
        return cb(null, {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => cb(err))
  },
  getRestaurant: (req, cb) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikeUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikeUsers.some(l => l.id === req.user.id)
        return cb(null, {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => cb(err))
  },
  getFeeds: (req, cb) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })])
      .then(([restaurants, comments]) => {
        cb(null, { restaurants, comments })
      })
      .catch(err => cb(err))
  },
  getTopRestaurants: (req, cb) => {
    // 撈出所有restaurant與FavoritedUsers資料
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        const result = restaurants
          .map(restaurant => ({
            ...restaurant.toJSON(),
            description: restaurant.description?.substring(0, 50),
            favoritedCount: restaurant.FavoritedUsers.length,
            isFavorited: req.user && req.user.FavoritedRestaurants?.some(f => f.id === restaurant.id)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        return cb(null, { restaurants: result })
      })
      .catch(err => cb(err))
  }
}

module.exports = restaurantServices
