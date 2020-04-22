// exports
exports.createPlayers = createPlayers;
exports.findLastWinner = findLastWinner;
exports.findPlayerById = findPlayerById;
exports.sendCardsMessages = sendCardsMessages;
exports.isAlreadyPlayed = isAlreadyPlayed;
// imports
const PROPERTIES = require('../properties.js');
const ERROR_CODES = require('../consts/error-codes.const.js');
const Player = require('../class/Player.js');
const whiteCardService = require('./whiteCard.service.js');
const utilService = require('./utils.service.js');

// functions
function createPlayers(voiceChannel, cardList) {
    const playerList = [];

    if(voiceChannel.members.length < PROPERTIES.MINIMUM_PLAYERS) {
        return {error: ERROR_CODES.NOT_ENOUGH_PLAYERS};
    }

    // creating list of members
    for (member of voiceChannel.members) {
        const user = member[1].user
        playerList.push(new Player(user, 0, whiteCardService.dealingCards(PROPERTIES.CARD_NUMBER, cardList), false));
        
    }

    // choosing first player
    const playerNumber = utilService.getRandomInt(playerList.length);
    playerList[playerNumber].lastWinner = true;
    
    return playerList;
}

function findLastWinner(playerList) {
    return playerList.find((el) => el.lastWinner);
}

async function sendCardsMessages(playerList) {
    for(player of playerList) {
        await player.user.createDM().then(async channel => await channel.send(whiteCardService.getCardMessage(player.cardList)));
    }
}

function findPlayerById(playerList, id) {
    return playerList.find((el) => el.user.id === id);
}

function isAlreadyPlayed(playedCardList, id) {
    return !!playedCardList.find((el) => el.player.user.id === id);
}