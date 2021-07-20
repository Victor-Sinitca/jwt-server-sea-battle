

const startGame =(ws,newMessageDate,startedGames)=> {
    if (newMessageDate.eventName === "startGame") {
        const sendGame = startedGames.filter(g => newMessageDate.date.gameId === g.gameId)
        console.log(sendGame)
        ws.send(JSON.stringify({
            eventName: "startGame",
            date: sendGame
        }))
    }
}

module.exports = startGame;
