const ProfileModel = require(`../models/profile-model`)
const ApiError = require(`../exceptions/api-error`)


class ProfileService {
    async getProfileUser(userId) {
        const profile = await ProfileModel.findById(userId)
        if(!profile){
            return ApiError.BadRequest("отсутствует профиль")
        }
        return profile
    }


    async updateStatusUSer(userId,status) {
        try {
            const profile = await ProfileModel.findById(userId)
            if(!profile){
                return ApiError.BadRequest("отсутствует профиль")
            }
            await profile.setStatus(status)
            await profile.save()
            return profile
        }catch (e) {
            return null
        }

    }
}

module.exports = new ProfileService()
