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
}

module.exports = new ProfileService()
