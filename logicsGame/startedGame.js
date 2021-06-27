const commonLogic = require('./commonLogic')
const checkForShipInput = require('./checkForSingleShipInput');
const deleteShipFromTheMap = require('./deleteShipFromTheMap');
const setShip = require('./setShip');
const setShot = require('./setShot');


class startedGame {
    gameId
    firstUser
    secondUser
    winnerUser
    gameData
    constructor(gameId, firstUser, secondUser) {
        this.gameId = gameId
        this.firstUser = firstUser
        this.secondUser = secondUser
        this.winnerUser = null
        this.gameData = {
            FUMap: commonLogic.initMap(),
            SUMap: commonLogic.initMap(),
            FUTurn: {turn: true},
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
    setShipRandom(isFirstUser) {
        let UMap = "FUMap", UShips = "FUShips"
        if (!isFirstUser) {
            UMap = "SUMap"
            UShips = "SUShips"
        }
        this.gameData[UMap] = commonLogic.initMap()
        this.gameData[UShips] = commonLogic.initUShips()
        let horizon = true;
        let shipInputState = [];
        for (let shipValue = 4; shipValue >= 1; shipValue--) {
            for (let numberOfShips = shipValue; numberOfShips <= 4; numberOfShips++) {
                horizon = Boolean(commonLogic.getRandomInt(2))
                shipInputState = checkForShipInput(this.gameData[UMap], horizon, shipValue, false).shipInputState;
                this.gameData = setShip(this.gameData, isFirstUser, shipInputState[commonLogic.getRandomInt(shipInputState.length)],
                    horizon, shipValue)
            }
        }
    }
    setShip(isFirstUser, date) {
        this.gameData = setShip(this.gameData, isFirstUser, date.sector,
            date.horizonSetShip, date.whatSetShip)
    }
    deleteShip(isFirstUser, date) {
        this.gameData = deleteShipFromTheMap(this.gameData, date.sector, isFirstUser)
    }
    clearMap(isFirstUser) {
        let UMap = "FUMap", UShips = "FUShips"
        if (!isFirstUser) {
            UMap = "SUMap"
            UShips = "SUShips"
        }
        this.gameData[UMap] = commonLogic.initMap()
        this.gameData[UShips] = commonLogic.initUShips()
    }
    async setShot(isFirstUser, firstUserProfile, secondUserProfile, date) {
        let UShips = "FUShips"
        if (isFirstUser) {
            UShips = "SUShips"
        }
        this.gameData = setShot(this.gameData, isFirstUser, date.sector)
        if (!(this.gameData[UShips].numberShips1 +
            this.gameData[UShips].numberShips2 +
            this.gameData[UShips].numberShips3 +
            this.gameData[UShips].numberShips4)) {
            this.winnerUser = isFirstUser? this.firstUser : this.secondUser
            try {
                await firstUserProfile.isWinn(isFirstUser)
                await secondUserProfile.isWinn(!isFirstUser)
            } catch (e) {
                console.log("")
            }
        }
    }
}
module.exports = startedGame;
