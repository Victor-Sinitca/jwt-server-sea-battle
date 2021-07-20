const startGameUser = (ws, newMessageDate, startedGames,clients,)=> {
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
                            if (clients.hasOwnProperty(key) &&
                                (clients[key].id === item.secondUser.id)) {
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
                            if (clients.hasOwnProperty(key) &&
                                (clients[key].id === item.firstUser.id)) {
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
}
module.exports = startGameUser;
