const {Schema, model} = require(`mongoose`)


const ProfileScheme = new Schema({
    name: {type: String, require: true},
    _id: {type: String, require: true},
    status: {type: String,},
    photo: {type: String,},
    gameSBState: {
        numberOfGamesSB: {type: Number,},
        numberOfWinsSB: {type: Number,},
    },
})

ProfileScheme.methods.getProfile = function () {
    return {
        name: this.name,
        id: this._id,
        status: this.status,
        photo: this.photo,
        gameSBState: this.gameSBState,
    }
};
ProfileScheme.methods.setStatus = function (status) {
    this.status = status
};
ProfileScheme.methods.setPhoto = function (photo) {
    this.photo = photo
};
ProfileScheme.methods.isWinn = function (isWinn) {
    if (isWinn) {
        this.gameSBState = {
            numberOfGamesSB: this.gameSBState.numberOfGamesSB + 1,
            numberOfWinsSB: this.gameSBState.numberOfWinsSB + 1,
        }
    } else {
        this.gameSBState = {
            numberOfGamesSB: this.gameSBState.numberOfGamesSB + 1,
            numberOfWinsSB: this.gameSBState.numberOfWinsSB,
        }
    }

};

module.exports = model("Profile", ProfileScheme)

