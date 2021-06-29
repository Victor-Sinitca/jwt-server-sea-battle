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
    async updateStatus(req, res, next) {
        try {
            const id = req.user.id;
            const {status} = req.body;
            /*console.log(`user:${JSON.stringify(user)}    status:${status}`)*/
            const ProfileDate = await ProfileService.getProfileUser(id)
            await ProfileDate.setStatus(status)
            await ProfileDate.save()
            return res.json(ProfileDate.status)
        } catch (e) {
            next(e)
        }
    }
    async updatePhoto(req, res, next) {
        try { console.log(`строка загруски фото:`)

            const imagePath = req.file.path.replace(/^public\//, '');
            console.log(`строка загруски фото: ${imagePath}`)
            res.redirect(imagePath);
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ProfileController()
