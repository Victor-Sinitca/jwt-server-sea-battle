const UserModel = require(`../models/user-model`)
const ProfileModel = require(`../models/profile-model`)
const bcrypt = require(`bcrypt`)
const uuid = require(`uuid`)
const mailService = require(`../service/mail-service`)
const tokenService = require(`../service/token-service`)
const ApiError = require(`../exceptions/api-error`)

const isProduction = process.env.NODE_ENV === 'production';
const API_URL= isProduction ? process.env.API_URL : process.env.DEV_API_URL

class UserService {
    async registration(email, password, name) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`пользователь с таким email:${email} уже зарегистрирован`,)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4()
        const user = await UserModel.create({email, password: hashPassword, activationLink})
        const profile = await ProfileModel.create({
            name, _id: user._id, status: `I am a new user`, photo: "", gameSBState: {
                numberOfGamesSB: 0,
                numberOfWinsSB: 0,
            }
        })
        await mailService.sendActivationMail(email, `${API_URL}/api/activate/${activationLink}`)
        const userDto = user.getUser()
        const profileDto = profile.getProfile()
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto, profile: profileDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest("некорректная ссылка для активации")
        }
        user.setIsActivated(true)
        await user.save()
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest(`пользователь с таким email не найден`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest("некорректный пароль")
        }
        const profile = await ProfileModel.findById(user._id)
        const userDto = user.getUser()
        const profileDto = profile.getProfile()
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto,profile: profileDto}

    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = await tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        const profile = await ProfileModel.findById(userData.id)
        const userDto = user.getUser()
        const profileDto = profile.getProfile()
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto,profile: profileDto}
    }
    async getAllUsers() {
        const users = await UserModel.find()
        return users.map(u => {
            return u.getUser()
        })
    }
}
module.exports = new UserService()
