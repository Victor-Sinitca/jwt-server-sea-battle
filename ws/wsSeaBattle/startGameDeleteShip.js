const startGameDeleteShip = (ws, newMessageDate, startedGames,) => {
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
}
module.exports = startGameDeleteShip;
