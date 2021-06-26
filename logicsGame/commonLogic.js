const {v1} = require('uuid');
const checkForShipInput = require('../logicsGame/checkForSingleShipInput');
const setShip = require('../logicsGame/setShip');

const commonLogic={
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    },
    initMap  ()  {
        let map = Array.from(Array(10), () => new Array(10))
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                map[i][j] = {
                    sector: {
                        ship: false,
                        shot: false,
                        x: j,
                        y: i,
                        unlock: false,
                        img: null
                    }
                }
            }
        }
        return map
    },
    initUShips  ()  {
        return {
            ship1: 4,
            ship2: 3,
            ship3: 2,
            ship4: 1,
            numberShips1: 4,
            numberShips2: 3,
            numberShips3: 2,
            numberShips4: 1,
        }
    },
    createGame  (gameId, firstUser, secondUser)  {
        return {
            gameId: gameId,
            firstUser: firstUser,
            secondUser: secondUser,
            winnerUser:null,
            gameData: {
                FUMap: commonLogic.initMap(),
                SUMap: commonLogic.initMap(),
                FUTurn: {
                    turn: true
                },
                FUShips: {
                    ship1: 4,
                    ship2: 3,
                    ship3: 2,
                    ship4: 1,
                    numberShips1: 4,
                    numberShips2: 3,
                    numberShips3: 2,
                    numberShips4: 1,
                },
                SUShips: {
                    ship1: 4,
                    ship2: 3,
                    ship3: 2,
                    ship4: 1,
                    numberShips1: 4,
                    numberShips2: 3,
                    numberShips3: 2,
                    numberShips4: 1,
                },
                settingShipUser: {
                    firstUser: true,
                    secondUser: true,
                },
            }
        }
    },
    createGameRoom (game, profile){
        return {
            firstUser: {
                id: game.userId,
                name: game.userName
            },
            secondUser: {
                id: profile.id,
                name: profile.name
            },
            gamesRoomId: v1()
        }
    },
    setShipRandom(item, isFirstUser){
        let UMap="FUMap", UShips="FUShips"
        if (!isFirstUser){
            UMap="SUMap"
            UShips="SUShips"
        }

        item.gameData[UMap] = commonLogic.initMap()
        item.gameData[UShips] = commonLogic.initUShips()
        let horizon = true;
        let shipInputState = [];
        for (let shipValue = 4; shipValue >= 1; shipValue--) {
            for (let numberOfShips = shipValue; numberOfShips <= 4; numberOfShips++) {
                horizon = Boolean(commonLogic.getRandomInt(2))
                shipInputState = checkForShipInput(item.gameData[UMap], horizon, shipValue, false).shipInputState;
                item.gameData = setShip(item.gameData, isFirstUser, shipInputState[commonLogic.getRandomInt(shipInputState.length)],
                    horizon, shipValue)
            }
        }
    }
}
module.exports = commonLogic;
