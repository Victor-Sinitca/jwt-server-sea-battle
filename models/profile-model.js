const {Schema, model} = require(`mongoose`)


const ProfileScheme = new Schema({
    name:{type: String,require: true},
    _id:{type: String,require: true},
    status:{type: String,},
    photo:{type: String,},
    gameSBState:{
        numberOfGamesSB:{type:Number,},
        numberOfWinsSB:{type:Number,},
    },
})
module.exports = model("Profile", ProfileScheme)

