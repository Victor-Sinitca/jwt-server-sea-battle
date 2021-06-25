module.exports = class ProfileDto {
    name
    id
    status
    photo
    gameSBState
    constructor(model) {
        this.name = model.name
        this.id = model._id
        this.status = model.status
        this.photo = model.photo
        this.gameSBState = model.gameSBState
    }
}
