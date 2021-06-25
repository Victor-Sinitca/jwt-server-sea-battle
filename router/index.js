const Router = require(`express`).Router
const userController = require(`../controllers/user-controller`)
const ProfileController = require(`../controllers/profile-controller`)
const {body}=require(`express-validator`)
const authMiddleware = require(`../middlewares/auth-middleware`)


const router = new Router()

router.post(`/registration`,
    body(`email`).isEmail(),
    body(`password`).isLength({min:5,max:35}),
    userController.registration)
router.post(`/login`,userController.login)
router.post(`/logout`,userController.logout)
router.get(`/activate/:link`,userController.activate)
router.get(`/refresh`,userController.refresh)
router.get(`/users`,authMiddleware,userController.getUsers)
router.get(`/profile/:id`,authMiddleware,ProfileController.getProfile)

module.exports = router
