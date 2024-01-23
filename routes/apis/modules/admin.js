const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/apis/admin-controller')
const categoryController = require('../../../controllers/apis/category-controller')
const upload = require('../../../middleware/multer')

// restaurants
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

// users
router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

// categories
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
