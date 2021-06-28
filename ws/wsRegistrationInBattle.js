const mongoose = require('mongoose');
const Profile = mongoose.model('Profile');
const commonLogic = require('../logicsGame/commonLogic')
const startedGame = require("../logicsGame/startedGame")
const {v1} = require('uuid');

const wsRegistrationInBattle = (ws, user, profile, invitationsInGames, newMessageDate,
                                clients, gameRooms, startedGames,setInvitationsInGames) => {
    if (newMessageDate.eventName === "listGame") {
        console.log(invitationsInGames)
        const newGame = [{
            nameGame: newMessageDate.date.nameGame,
            userId: user.id,
            userName: profile.name,
            id: v1()
        }]
        invitationsInGames.push(newGame[0])

        for (let key in clients) {
            clients[key].webSocket.send(JSON.stringify({
                eventName: "listGame",
                date: {
                    games: newGame
                }
            }))
        }
    }
    if (newMessageDate.eventName === "deleteGameOfId") {
        const newInvitationsInGames = invitationsInGames.filter(game => {
            if (game.id === newMessageDate.date.id) {
                for (let key in clients) {
                    clients[key].webSocket.send(JSON.stringify({
                        eventName: "deleteGameOfId",
                        date: {
                            message: `game id = ${newMessageDate.date.id} is delete`,
                            idGameDelete: newMessageDate.date.id
                        }
                    }))
                }
                return false
            } else return true
        });
        setInvitationsInGames(newInvitationsInGames)
    }

    if (newMessageDate.eventName === "acceptGameOfId") {
        const newInvitationsInGames = invitationsInGames.filter(game => {
            if (game.id === newMessageDate.date.id
                && game.userId !== user.id) {
                const gameRoom = commonLogic.createGameRoom(game, profile)
                const newGame = new startedGame(gameRoom.gamesRoomId, gameRoom.firstUser, gameRoom.secondUser)
                gameRooms.push(gameRoom)
                startedGames.push(newGame)
                for (let key in clients) {
                    if (clients[key].id === game.userId || clients[key].id === user.id) {
                        clients[key].webSocket.send(JSON.stringify({
                            eventName: "acceptGameOfId",
                            date: [gameRoom]
                        }))
                    }
                    clients[key].webSocket.send(JSON.stringify({
                        eventName: "deleteGameOfId",
                        date: {
                            message: `game id = ${newMessageDate.date.id} is accept`,
                            idGameDelete: newMessageDate.date.id
                        }
                    }))
                }
                return false
            } else return true
        });
        setInvitationsInGames(newInvitationsInGames)
    }

}
module.exports = wsRegistrationInBattle;
