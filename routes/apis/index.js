const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const commentController = require('../../controllers/apis/comment-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const upload = require('../../middleware/multer')

// admin
router.use('/admin', authenticated, authenticatedAdmin, admin)

// restaurant
router.get('/restaurants/top', authenticated,
/* #swagger.tags = ['Restaurant']
   #swagger.description = '瀏覽收藏數最多的前10筆餐廳'
   #swagger.security = [{
            "apiKeyAuth": []
    }]
 */
  restController.getTopRestaurants)

router.get('/restaurants/feeds', authenticated,
/* #swagger.tags = ['Restaurant']
   #swagger.description = '瀏覽最新上架的10 筆餐廳及最新的 10 筆評論'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  restController.getFeeds)

router.get('/restaurants/:id', authenticated,
  /* #swagger.tags = ['Restaurant']
   #swagger.description = '瀏覽個別餐廳詳細資料(前台)'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  restController.getRestaurant)

router.get('/restaurants', authenticated,
  /* #swagger.tags = ['Restaurant']
   #swagger.description = '瀏覽所有餐廳詳細資料(前台)'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  restController.getRestaurants)

// comment
router.delete('/comments/:id', authenticated, authenticatedAdmin,
/* #swagger.tags = ['Comment']
   #swagger.description = '管理員刪除評論(僅後臺管理者)'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  commentController.deleteComment) // 兩個驗證都要掛載(jwt驗證寫在authenticated中)

router.post('/comments', authenticated,
/* #swagger.tags = ['Comment']
   #swagger.description = '使用者對餐廳留下評論'
   #swagger.parameters['obj'] = {
            in: 'body',
            description: 'User information.',
            required: true,
            schema: {
    "restaurantId":57,
    "text":"good restaurant!"}}
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  commentController.postComment)

// user
router.post('/signup',
/*  #swagger.tags = ['User']
    #swagger.description = '使用者註冊'
    #swagger.parameters['user name, email, password, passwordCheck'] = {
            in: 'body',
            description: 'user name, email, password, passwordCheck.',
            required: true,
            schema: {
    "name":"bob",
    "email":"root@example.com",
    "password":"1234",
    "passwordCheck":"1234"
}
    } */
  userController.signUp)

router.post('/signin', passport.authenticate('local', { session: false }),
/*  #swagger.tags = ['User']
    #swagger.description = '使用者登入'
    #swagger.parameters['user email, password'] = {
            in: 'body',
            description: 'user email and password.',
            required: true,
            schema: {
    "email":"root@example.com",
    "password":"12345678"
 }
    } */
  userController.signIn)

router.get('/users/top', authenticated,
/* #swagger.tags = ['User']
   #swagger.description = '可以查看最有人氣的前十位使用者(美食達人)'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  userController.getTopUsers)

router.get('/users/:id', authenticated,
/* #swagger.tags = ['User']
   #swagger.description = '使用者可以查看自己的個人資料、查看自己評論過、收藏過的餐廳、查看自己追蹤中的使用者與正在追蹤自己的使用者'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  userController.getUser)

router.put('/users/:id', authenticated, upload.single('image'),
/* #swagger.tags = ['User']
   #swagger.description = '使用者可以編輯自己的個人資料(更改名字與上傳圖片)'
   #swagger.parameters['user name, image'] = {
            in: 'body',
            description: 'user name, image',
            required: true,
            schema: { $ref: "#/definitions/AddUser" }}
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  userController.putUser)

router.post('/favorite/:restaurantId', authenticated,
/* #swagger.tags = ['User']
   #swagger.description = '收藏餐廳'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  userController.addFavorite)

router.delete('/favorite/:restaurantId', authenticated,
/* #swagger.tags = ['User']
   #swagger.description = '取消收藏餐廳'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  userController.removeFavorite)

router.post('/like/:restaurantId', authenticated,
/* #swagger.tags = ['User']
   #swagger.description = '點讚Like餐廳'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  userController.addLike)

router.delete('/like/:restaurantId', authenticated,
/* #swagger.tags = ['User']
   #swagger.description = '取消點讚like餐廳'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  userController.removeLike)

router.post('/following/:userId', authenticated,
/* #swagger.tags = ['User']
   #swagger.description = '追蹤其他使用者'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  userController.addFollowing)

router.delete('/following/:userId', authenticated,
/* #swagger.tags = ['User']
   #swagger.description = '取消追蹤其他使用者'
   #swagger.security = [{
            "apiKeyAuth": []
    }] */
  userController.removeFollowing)

router.use('/', apiErrorHandler)

module.exports = router
