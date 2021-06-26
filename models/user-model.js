const {Schema, model} = require(`mongoose`)


const UserScheme = new Schema({
    email: {type: String, unique: true, require: true},
    password: {type: String, require: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
})

UserScheme.methods.getUser = function () {
    return {
        email: this.email,
        id: this._id,
        isActivated: this.isActivated,
    }
};
UserScheme.methods.setIsActivated = function () {
    return {
        email: this.email,
        id: this._id,
        isActivated: this.isActivated,
    }
};


module.exports = model("User", UserScheme)

