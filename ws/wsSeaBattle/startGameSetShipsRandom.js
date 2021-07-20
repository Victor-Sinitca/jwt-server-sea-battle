const startGameSetShipsRandom = (ws, newMessageDate, startedGames,) => {
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
}
module.exports = startGameSetShipsRandom;
