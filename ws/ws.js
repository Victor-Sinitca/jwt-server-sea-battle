const mongoose = require('mongoose');
const {v1} = require('uuid');
const setShot = require('../logicsGame/setShot');
const setShip = require('../logicsGame/setShip');
const deleteShipFromTheMap = require('../logicsGame/deleteShipFromTheMap');
const commonLogic = require('../logicsGame/commonLogic')
const Profile = mongoose.model('Profile');


let clients = {};
let messages = []
let invitationsInGames = []
let gameRooms = []
let startedGames = []


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
        if (newMessageDate.eventName === "listGame") {
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
        if (newMessageDate.eventName === "message") {
            const newMessage = [{
                message: newMessageDate.date.messages,
                photo: profile.photo ?? "",
                userId: user.id,
                userName: profile.name
            }]
            messages.push(newMessage[0])
            for (let key in clients) {
                clients[key].webSocket.send(JSON.stringify({
                    eventName: "message",
                    date: {
                        messages: newMessage,
                    }
                }))
            }
        }
        if (newMessageDate.eventName === "deleteGameOfId") {
            invitationsInGames = invitationsInGames.filter(game => {
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
        }
        if (newMessageDate.eventName === "acceptGameOfId") {
            invitationsInGames = invitationsInGames.filter(game => {
                if (game.id === newMessageDate.date.id
                    && game.userId !== user.id) {
                    const gameRoom = commonLogic.createGameRoom(game, profile)
                    const newGame = commonLogic.createGame(gameRoom.gamesRoomId, gameRoom.firstUser, gameRoom.secondUser)
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
        }
        if (newMessageDate.eventName === "startGame") {
            const sendGame = startedGames.filter(g => newMessageDate.date.gameId === g.gameId)
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
                    item.gameData = setShip(item.gameData, true, newMessageDate.date.sector,
                        newMessageDate.date.horizonSetShip, newMessageDate.date.whatSetShip)
                    ws.send(JSON.stringify({
                        eventName: "startGame",
                        date: [item]
                    }))
                }
                if ((item.gameId === newMessageDate.date.gameId) &&
                    ((newMessageDate.date.userId === item.secondUser.id) === item.gameData.settingShipUser.secondUser)) {
                    item.gameData = setShip(item.gameData, false, newMessageDate.date.sector,
                        newMessageDate.date.horizonSetShip, newMessageDate.date.whatSetShip)
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
                    item.gameData = deleteShipFromTheMap(item.gameData, newMessageDate.date.sector, true)
                    ws.send(JSON.stringify({
                        eventName: "startGame",
                        date: [item]
                    }))
                }
                if ((item.gameId === newMessageDate.date.gameId) &&
                    ((newMessageDate.date.userId === item.secondUser.id) === item.gameData.settingShipUser.secondUser)) {
                    item.gameData = item.gameData = deleteShipFromTheMap(item.gameData, newMessageDate.date.sector, false)
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
                    commonLogic.setShipRandom(item, true)
                    ws.send(JSON.stringify({
                        eventName: "startGame",
                        date: [item]
                    }))
                }
                if ((item.gameId === newMessageDate.date.gameId) &&
                    (newMessageDate.date.userId === item.secondUser.id) && item.gameData.settingShipUser.secondUser) {
                    commonLogic.setShipRandom(item, false)
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
                    item.gameData.FUMap = commonLogic.initMap()
                    item.gameData.FUShips = commonLogic.initUShips()
                    ws.send(JSON.stringify({
                        eventName: "startGame",
                        date: [item]
                    }))
                }
                if ((item.gameId === newMessageDate.date.gameId) &&
                    (newMessageDate.date.userId === item.secondUser.id) && item.gameData.settingShipUser.secondUser) {
                    item.gameData.SUMap = commonLogic.initMap()
                    item.gameData.SUShips = commonLogic.initUShips()
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
                if ((item.gameId === newMessageDate.date.gameId) &&
                    ((newMessageDate.date.userId === item.firstUser.id) === item.gameData.settingShipUser.firstUser)) {
                    item.gameData.settingShipUser.firstUser = false
                }
                if ((item.gameId === newMessageDate.date.gameId) &&
                    ((newMessageDate.date.userId === item.secondUser.id) === item.gameData.settingShipUser.secondUser)) {
                    item.gameData.settingShipUser.secondUser = false
                }
                ws.send(JSON.stringify({
                    eventName: "startGame",
                    date: [item]
                }))
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

                    item.gameData = setShot(item.gameData, isFirstUser, newMessageDate.date.sector)
                     if (isFirstUser) {
                         if (!(item.gameData.SUShips.numberShips1 +
                             item.gameData.SUShips.numberShips2 +
                             item.gameData.SUShips.numberShips3 +
                             item.gameData.SUShips.numberShips4)) {
                             item.winnerUser=item.firstUser
                             firstUserProfile.isWinn(true)
                             secondUserProfile.isWinn(false)
                         }
                     } else if (!(item.gameData.FUShips.numberShips1 +
                         item.gameData.FUShips.numberShips2 +
                         item.gameData.FUShips.numberShips3 +
                         item.gameData.FUShips.numberShips4)) {
                         item.winnerUser=item.secondUser
                         firstUserProfile.isWinn(false)
                         secondUserProfile.isWinn(true)
                     }
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
    });


    ws.on('close', function () {
        console.log('соединение закрыто ' + user.id);
        delete clients[user.id];
    });
};


module.exports = getWs;
