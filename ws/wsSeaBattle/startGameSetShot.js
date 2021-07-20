const startGameSetShot = (ws, newMessageDate, startedGames, Profile, clients) => {
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
                    if (clients.hasOwnProperty(key) &&
                        (clients[key].id === item.firstUser.id || clients[key].id === item.secondUser.id)) {
                        clients[key].webSocket.send(JSON.stringify({
                            eventName: "startGame",
                            date: [item]
                        }))
                    }
                }
            }
        });
    }
}
module.exports = startGameSetShot;
