const mongoose = require('mongoose');
const Profile = mongoose.model('Profile');
const wsSeaBattle = require("./wsSeaBattle")
const wsRegistrationInBattle = require("./wsRegistrationInBattle")
const wsGeneralChat = require("./wsGeneralChat")


let clients = {};
let messages = []
let invitationsInGames = []
let gameRooms = []
let startedGames = []

const setGameRooms = (newDate) => {gameRooms = newDate}
const setInvitationsInGames = (newDate) => {invitationsInGames = newDate}

const getWs = async (ws, url, user) => {
    console.log(user)
    clients[user.id] = {
        id: user.id,
        webSocket: ws
    };
    console.log("новое соединение " + user.id);
    const profile = await Profile.findById(user.id)
        .then((userProfile) => {
            if (!userProfile) {
                return null;
            }
            return userProfile;
        });
    if (!profile) {
        ws.close(JSON.stringify({
            eventName: "errorAuthorize",
            date: {messages: "you are not logged in",}
        }))
    }
    console.log(profile)
    ws.send(JSON.stringify({
        eventName: "allDate",
        date: {
            messages: messages,
            games: invitationsInGames,
        }
    }))
    const sendRoom = gameRooms.filter(r => (user.id === r.firstUser.id || user.id === r.secondUser.id))
    ws.send(JSON.stringify({
        eventName: "acceptGameOfId",
        date: sendRoom
    }))

    ws.on('message', function (message) {
        console.log('получено сообщение ' + message);
        const newMessageDate = JSON.parse(message)
        wsGeneralChat(newMessageDate, messages, clients, profile, user)
        wsRegistrationInBattle(ws, user, profile, invitationsInGames, newMessageDate, clients,
            gameRooms, startedGames, setInvitationsInGames)
        wsSeaBattle(ws, user, newMessageDate, clients, gameRooms, startedGames, setGameRooms,profile)
    });
    ws.on('close', function () {
        console.log('соединение закрыто ' + user.id);
        delete clients[user.id];
    });
};


module.exports = getWs;
