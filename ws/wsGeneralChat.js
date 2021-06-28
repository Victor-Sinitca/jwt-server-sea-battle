const wsGeneralChat = (newMessageDate, messages, clients, profile, user) => {
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
}
module.exports = wsGeneralChat
