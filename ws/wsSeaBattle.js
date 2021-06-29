const mongoose = require('mongoose');
const Profile = mongoose.model('Profile');

const wsSeaBattle = (ws, user, newMessageDate, clients, gameRooms, startedGames, setGameRooms, profile) => {
    if (newMessageDate.eventName === "startGame") {
        const sendGame = startedGames.filter(g => newMessageDate.date.gameId === g.gameId)
        console.log(sendGame)
        ws.send(JSON.stringify({
            eventName: "startGame",
            date: sendGame
        }))
    }

    if (newMessageDate.eventName === "startGameSetShip") {
        /*const newMessageDateReceived = {
            eventName: "startGameSetShip",
            date: {
                sector: {
                    x: sector.x,
                    y: sector.y,
                },
                gameId: gameId,
                userId: userId,
                horizonSetShip: horizonSetShip,
                whatSetShip: whatSetShip
            }
        }*/
        startedGames.forEach(function (item, index, array) {
            if ((item.gameId === newMessageDate.date.gameId) &&
                ((newMessageDate.date.userId === item.firstUser.id) === item.gameData.settingShipUser.firstUser)) {
                item.setShip(true, newMessageDate.date)
                ws.send(JSON.stringify({
                    eventName: "startGame",
                    date: [item]
                }))
            }
            if ((item.gameId === newMessageDate.date.gameId) &&
                ((newMessageDate.date.userId === item.secondUser.id) === item.gameData.settingShipUser.secondUser)) {
                item.setShip(false, newMessageDate.date)
                ws.send(JSON.stringify({
                    eventName: "startGame",
                    date: [item]
                }))
            }
        });
    }
    if (newMessageDate.eventName === "startGameDeleteShip") {
        /*const newMessageDateReceived = {
            eventName: "startGameDeleteShip",
            date: {
                sector: {
                    ship: boolean,
                    shot: boolean,
                    x: number,
                    y: number,
                    unlock: boolean,
                    img: null | number
                },
                gameId: gameId,
                userId: userId
            }
        }*/
        startedGames.forEach(function (item, index, array) {
            if ((item.gameId === newMessageDate.date.gameId) &&
                ((newMessageDate.date.userId === item.firstUser.id) === item.gameData.settingShipUser.firstUser)) {
                item.deleteShip(true, newMessageDate.date)
                ws.send(JSON.stringify({
                    eventName: "startGame",
                    date: [item]
                }))
            }
            if ((item.gameId === newMessageDate.date.gameId) &&
                ((newMessageDate.date.userId === item.secondUser.id) === item.gameData.settingShipUser.secondUser)) {
                item.deleteShip(false, newMessageDate.date)
                ws.send(JSON.stringify({
                    eventName: "startGame",
                    date: [item]
                }))
            }
        });
    }
    if (newMessageDate.eventName === "startGameSetShipsRandom") {
        /* const newMessageDateReceived = {
             eventName: "startGameSetShipsRandom",
             date: {
                 gameId: gameId,
                 userId: userId
             }
         }*/
        startedGames.forEach(function (item, index, array) {
            if ((item.gameId === newMessageDate.date.gameId) &&
                (newMessageDate.date.userId === item.firstUser.id) && item.gameData.settingShipUser.firstUser) {
                item.setShipRandom(true)
                ws.send(JSON.stringify({
                    eventName: "startGame",
                    date: [item]
                }))
            }
            if ((item.gameId === newMessageDate.date.gameId) &&
                (newMessageDate.date.userId === item.secondUser.id) && item.gameData.settingShipUser.secondUser) {
                item.setShipRandom(false)
                ws.send(JSON.stringify({
                    eventName: "startGame",
                    date: [item]
                }))
            }
        });
    }
    if (newMessageDate.eventName === "startGameClearMap") {
        /* const newMessageDateReceived = {
             eventName: "startGameSetShipsRandom",
             date: {
                 gameId: gameId,
                 userId: userId
             }
         }*/
        startedGames.forEach(function (item, index, array) {
            if ((item.gameId === newMessageDate.date.gameId) &&
                (newMessageDate.date.userId === item.firstUser.id) && item.gameData.settingShipUser.firstUser) {
                item.clearMap(true)
                ws.send(JSON.stringify({
                    eventName: "startGame",
                    date: [item]
                }))
            }
            if ((item.gameId === newMessageDate.date.gameId) &&
                (newMessageDate.date.userId === item.secondUser.id) && item.gameData.settingShipUser.secondUser) {
                item.clearMap(false)
                ws.send(JSON.stringify({
                    eventName: "startGame",
                    date: [item]
                }))
            }
        });
    }
    if (newMessageDate.eventName === "startGameUser") {
        /*            const newMessageDateReceived = {
                        eventName: "startGameUser",
                        date: {
                            gameId: gameId,
                            userId: userId
                        }
                    }*/
        startedGames.forEach(function (item, index, array) {
            if (item.gameId === newMessageDate.date.gameId) {
                if ((newMessageDate.date.userId === item.firstUser.id) === item.gameData.settingShipUser.firstUser) {
                    item.gameData.settingShipUser.firstUser = false
                    if (!item.gameData.settingShipUser.secondUser) {
                        for (let key in clients) {
                            if (clients[key].id === item.secondUser.id) {
                                clients[key].webSocket.send(JSON.stringify({
                                    eventName: "startGame",
                                    date: [item]
                                }))
                            }
                        }
                    }
                }
                if ((newMessageDate.date.userId === item.secondUser.id) === item.gameData.settingShipUser.secondUser) {
                    item.gameData.settingShipUser.secondUser = false
                    if (!item.gameData.settingShipUser.firstUser) {
                        for (let key in clients) {
                            if (clients[key].id === item.firstUser.id) {
                                clients[key].webSocket.send(JSON.stringify({
                                    eventName: "startGame",
                                    date: [item]
                                }))
                            }
                        }
                    }
                }
                ws.send(JSON.stringify({
                    eventName: "startGame",
                    date: [item]
                }))
            }
        });
    }
    if (newMessageDate.eventName === "startGameSetShot") {
        /*                        const newMessageDateReceived = {
                                    eventName: "userTurn",
                                    date: {
                                        gameId: "",
                                        userId: "",
                                        sector: {
                                            ship: boolean,
                                            shot: boolean,
                                            x: number,
                                            y: number,
                                            unlock: boolean,
                                            img: null | number
                                        }
                                    }
                                }*/
        startedGames.forEach(async function (item, index, array) {
            let isFirstUser = null
            if ((item.gameId === newMessageDate.date.gameId) &&
                (newMessageDate.date.userId === item.firstUser.id) && item.gameData.FUTurn.turn) {
                isFirstUser = true
            }
            if ((item.gameId === newMessageDate.date.gameId) &&
                (newMessageDate.date.userId === item.secondUser.id) && !item.gameData.FUTurn.turn) {
                isFirstUser = false
            }
            if (isFirstUser === false || isFirstUser === true) {
                const firstUserProfile = await Profile.findById(item.firstUser.id)
                const secondUserProfile = await Profile.findById(item.secondUser.id)
                await item.setShot(isFirstUser, firstUserProfile, secondUserProfile, newMessageDate.date)
                firstUserProfile.save()
                secondUserProfile.save()
                for (let key in clients) {
                    if (clients[key].id === item.firstUser.id || clients[key].id === item.secondUser.id) {
                        clients[key].webSocket.send(JSON.stringify({
                            eventName: "startGame",
                            date: [item]
                        }))
                    }
                }
            }
        });
    }
    if (newMessageDate.eventName === "startGameSendMessage") {
        /*                        const newMessageDateReceived = {
                                    eventName: "startGameSendMessage",
                                    date: {
                                        gameId: "",
                                        message: ""
                                    }
                                }*/
        const newMessage = [{
            message: newMessageDate.date.message,
            photo: profile.photo ?? "",
            userId: user.id,
            userName: profile.name
        }]
        startedGames.forEach(async function (item, index, array) {
                if (item.gameId === newMessageDate.date.gameId){
                    item.chatData.push(newMessage[0])
                    for (let key in clients) {
                        if (clients[key].id === item.firstUser.id || clients[key].id === item.secondUser.id) {
                            clients[key].webSocket.send(JSON.stringify({
                                eventName: "startGameSendMessage",
                                date: {
                                    gameId: newMessageDate.date.gameId,
                                    messages: newMessage
                                }
                            }))
                        }
                    }
                }
            }
        );
    }
    if (newMessageDate.eventName === "leaveGameRoomOfId") {
        /*gameRoom={
            firstUser: {
                id: game.userId,
                name: game.userName
            },
            secondUser: {
                id: profile.id,
                name: profile.name
            },
            gamesRoomId: v1()
        }*/

        const newGameRooms = gameRooms.filter(game => {
            if (game.gamesRoomId === newMessageDate.date.gamesRoomId) {
                if (game.firstUser.id === newMessageDate.date.userId) {
                    game.firstUser.id = null
                    if (!game.secondUser.id) {
                        ws.send(JSON.stringify({
                            eventName: "startGameDeleteGameOfId",
                            date: game
                        }))
                        startedGames = startedGames.filter(g => g.gameId !== game.gamesRoomId)
                        return false
                    } else {
                        ws.send(JSON.stringify({
                            eventName: "startGameDeleteGameOfId",
                            date: game
                        }))
                        for (let key in clients) {
                            if (clients[key].id === game.secondUser.id) {
                                clients[key].webSocket.send(JSON.stringify({
                                    eventName: "startGameDeleteGameOfId",
                                    date: game
                                }))
                            }
                        }
                    }
                }
                if (game.secondUser.id === newMessageDate.date.userId) {
                    game.secondUser.id = null
                    if (!game.firstUser.id) {
                        ws.send(JSON.stringify({
                            eventName: "startGameDeleteGameOfId",
                            date: game
                        }))
                        startedGames = startedGames.filter(g => g.gameId !== game.gamesRoomId)
                        return false
                    } else {
                        ws.send(JSON.stringify({
                            eventName: "startGameDeleteGameOfId",
                            date: game
                        }))
                        for (let key in clients) {
                            if (clients[key].id === game.firstUser.id) {
                                clients[key].webSocket.send(JSON.stringify({
                                    eventName: "startGameDeleteGameOfId",
                                    date: game
                                }))
                            }
                        }
                    }
                }
                return true
            } else return true
        });
        setGameRooms(newGameRooms)

    }
}
module.exports = wsSeaBattle;
