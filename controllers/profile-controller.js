const ProfileService = require(`../service/profile-service`)

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
}

module.exports = new ProfileController()
