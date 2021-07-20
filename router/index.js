const Router = require(`express`).Router
const userController = require(`../controllers/user-controller`)
const ProfileController = require(`../controllers/profile-controller`)
const {body}=require(`express-validator`)
const authMiddleware = require(`../middlewares/auth-middleware`)
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage });

const router = new Router()

router.post(`/registration`,
    body(`email`).isEmail(),
    body(`password`).isLength({min:5,max:35}),
    userController.registration)
router.post(`/login`,userController.login)
router.post(`/logout`,userController.logout)
router.get(`/activate/:link`,userController.activate)
router.get(`/refresh`,userController.refresh)
router.get(`/users`,userController.getUsers)
router.get(`/profile/:id`,authMiddleware,ProfileController.getProfile)
router.post(`/profile/status`,authMiddleware,ProfileController.updateStatus)
router.post(`/profile/uploadPhoto`,authMiddleware, upload.single('wallpaper'), ProfileController.updatePhoto)

module.exports = router
