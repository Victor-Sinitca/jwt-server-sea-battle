



const leaveGameRoomOfId =(ws, newMessageDate, startedGames, gameRooms, clients, setGameRooms)=> {
    function leaveGameRoomOfUser(game,user1, user2) {
        if (game.hasOwnProperty(user1) && game[user1].id === newMessageDate.date.userId) {
            game[user1].id = null
            if (game.hasOwnProperty(user2) && !game[user2].id) {
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
                    if (clients.hasOwnProperty(key) &&
                        (clients[key].id === game[user2].id)) {
                        clients[key].webSocket.send(JSON.stringify({
                            eventName: "startGameDeleteGameOfId",
                            date: game
                        }))
                    }
                }
            }
        }
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
                leaveGameRoomOfUser(game,"firstUser","secondUser")
                leaveGameRoomOfUser(game,"secondUser","firstUser")
              /*  if (game.firstUser.id === newMessageDate.date.userId) {
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
                            if (clients.hasOwnProperty(key) &&
                                (clients[key].id === game.secondUser.id)) {
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
                            if (clients.hasOwnProperty(key) &&
                                (clients[key].id === game.firstUser.id)) {
                                clients[key].webSocket.send(JSON.stringify({
                                    eventName: "startGameDeleteGameOfId",
                                    date: game
                                }))
                            }
                        }
                    }
                }*/
                return true
            } else return true
        });
        setGameRooms(newGameRooms)
    }
}

module.exports = leaveGameRoomOfId;
