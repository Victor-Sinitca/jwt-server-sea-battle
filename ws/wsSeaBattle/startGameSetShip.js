

const startGameSetShip = (ws,newMessageDate,startedGames,) => {
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
}

module.exports = startGameSetShip;
