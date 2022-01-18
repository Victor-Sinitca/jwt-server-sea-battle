const ProfileService = require(`../service/profile-service`)
const ApiError = require(`../exceptions/api-error`)
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)
const isProduction = process.env.NODE_ENV === 'production';
const API_URL= isProduction ? process.env.API_URL : process.env.DEV_API_URL

class ProfileController {
    async getProfile(req, res, next) {
        try {
            const id = req.params.id;
            const ProfileDate = await ProfileService.getProfileUser(id)
            return res.json(ProfileDate)
        } catch (e) {
            next(e)
        }
    }
    async updateStatus(req, res, next) {
        try {
            const id = req.user.id;
            const {status} = req.body;
            const ProfileDate = await ProfileService.updateStatusUSer(id, status)
            if(ProfileDate){
                return res.json(ProfileDate.status)
            }
            return next(ApiError.BadRequest(`ошибка обновления статуса `, errors.array()))
        } catch (e) {
            next(e)
        }
    }
    async updatePhoto(req, res, next) {
        try {
            const id = req.user.id;
            const imagePath = req.file.path.replace();
            const imagePathReturn= API_URL + `/` + imagePath.replace(/\\/g,`/`)
            const ProfileDate = await ProfileService.getProfileUser(id)
            if(ProfileDate.photo){
                try {
                    await unlinkAsync(ProfileDate.photo.replace(/\//g,`/\\/`))
                }catch (e) {
                    console.log(e)
                }
            }
            await ProfileDate.setPhoto(imagePathReturn)
            await ProfileDate.save()
          return res.json(imagePathReturn)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ProfileController()
