const { Restaurant, Category, User } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const adminServices = {
  getRestaurants: (req, cb) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => cb(null, { restaurants }))
      .catch(err => cb(err))
  },
  postRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    localFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      }))
      .then(newRestaurant => cb(null, { restaurant: newRestaurant }))
      .catch(err => cb(err))
  },
  deleteRestaurant: (req, cb) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error("Restaurant didn't exist!")
          err.status = 404
          throw err
        }
        return restaurant.destroy()
      })
      .then(deletedRestaurant => cb(null, { restaurant: deletedRestaurant }))
      .catch(err => cb(err))
  },
  getRestaurant: (req, cb) => {
    const restaurantId = req.params.id
    return Restaurant.findByPk(restaurantId, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return cb(null, { restaurant })
      })
      .catch(err => cb(err))
  },
  putRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    Promise.all([
      Restaurant.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
          categoryId
        })
      })
      .then(updatedRestaurant => cb(null, { updatedRestaurant }))
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    return User.findAll({
      raw: true
    })
      .then(users => {
        const usersData = users.map(user => ({
          ...user,
          password: '********'
        }))
        return cb(null, { users: usersData })
      })
      .catch(err => cb(err))
  },
  patchUser: (req, cb) => {
    const userId = req.params.id
    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        if (user.email === 'root@example.com') throw new Error('禁止變更 root 權限')
        return user.update({
          isAdmin: !user.isAdmin
        })
      })
      .then(userUpdated => {
        const userUpdatedData = userUpdated.toJSON()
        delete userUpdatedData.password
        return cb(null, { userUpdated: userUpdatedData })
      })
      .catch(err => cb(err))
  }
}

module.exports = adminServices
