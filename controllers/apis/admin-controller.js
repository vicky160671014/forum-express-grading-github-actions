const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postRestaurant: (req, res, next) => {
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    adminServices.postRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteRestaurant: (req, res, next) => {
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    adminServices.deleteRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getRestaurant: (req, res, next) => {
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    adminServices.getRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  putRestaurant: (req, res, next) => {
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    adminServices.putRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUsers: (req, res, next) => {
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  patchUser: (req, res, next) => {
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    adminServices.patchUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = adminController
