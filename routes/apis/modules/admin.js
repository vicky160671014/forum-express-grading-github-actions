const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/apis/admin-controller')
const categoryController = require('../../../controllers/apis/category-controller')
const upload = require('../../../middleware/multer')

// restaurants
router.delete('/restaurants/:id',
/* #swagger.tags = ['Admin']
   #swagger.description = '刪除一家餐廳 (後台)'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  adminController.deleteRestaurant)

router.get('/restaurants/:id',
/* #swagger.tags = ['Admin']
   #swagger.description = '顯示一家餐廳 (後台)'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  adminController.getRestaurant)

router.put('/restaurants/:id', upload.single('image'),
/* #swagger.tags = ['Admin']
   #swagger.description = '修改一家餐廳(後台)'
   #swagger.parameters['name, tel, address, openingHours, description, categoryId, image'] = {
            in: 'body',
            description: 'restaurant name, tel, address, openingHours, description, categoryId, image',
            required: true,
            schema: {
    "name": "Ms. Kristi Wisozk",
    "tel": "(578) 553-2172 x6730"
 }}
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  adminController.putRestaurant)

router.get('/restaurants',
/* #swagger.tags = ['Admin']
   #swagger.description = '瀏覽所有餐廳詳細資料(後台)'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  adminController.getRestaurants)

router.post('/restaurants', upload.single('image'),
/* #swagger.tags = ['Admin']
   #swagger.description = '新增一家餐廳 (後台)'
   #swagger.parameters['name, tel, address, openingHours, description, categoryId, image'] = {
            in: 'body',
            description: 'restaurant name, tel, address, openingHours, description, categoryId, image',
            required: true,
            schema: {
    "name":"饅頭",
    "tel": "123123",
    "address": "123123",
    "openingHours": "09:00",
    "description": "123123 ehrfiqhwihqiw lsihfiashf",
    "categoryId":"2"
 }}
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  adminController.postRestaurant)

// users
router.patch('/users/:id',
/* #swagger.tags = ['Admin']
   #swagger.description = '變更用戶權限(後台)'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  adminController.patchUser)

router.get('/users',
/* #swagger.tags = ['Admin']
   #swagger.description = '瀏覽所有用戶(後台)'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  adminController.getUsers)

// categories
router.put('/categories/:id',
/* #swagger.tags = ['Admin']
   #swagger.description = '修改類別(後台)'
   #swagger.parameters['name'] = {
            in: 'body',
            description: 'category name',
            required: true,
            schema: { "name":"現萃飲料" }}
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  categoryController.putCategory)

router.delete('/categories/:id',
/* #swagger.tags = ['Admin']
   #swagger.description = '刪除類別(後台)'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  categoryController.deleteCategory)

router.get('/categories',
/* #swagger.tags = ['Admin']
   #swagger.description = '查看所有類別(後台)'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  categoryController.getCategories)

router.post('/categories',
/* #swagger.tags = ['Admin']
   #swagger.description = '新增類別(後台)'
   #swagger.parameters['name'] = {
            in: 'body',
            description: 'category name',
            required: true,
            schema: { "name":"現萃飲料" }}
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  categoryController.postCategory)

router.get('/', (req, res) => {
  // #swagger.ignore = true
  res.redirect('/admin/restaurants')
})

module.exports = router
