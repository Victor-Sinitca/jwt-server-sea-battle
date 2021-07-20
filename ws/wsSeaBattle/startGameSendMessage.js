const startGameSendMessage = (ws, newMessageDate, startedGames, profile, clients) => {
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
            userId: profile.id,
            userName: profile.name
        }]
        startedGames.forEach(async function (item, index, array) {
                if (item.gameId === newMessageDate.date.gameId) {
                    item.chatData.push(newMessage[0])
                    for (let key in clients) {
                        if (clients.hasOwnProperty(key) &&
                            (clients[key].id === item.firstUser.id || clients[key].id === item.secondUser.id)) {
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
}
module.exports = startGameSendMessage;
