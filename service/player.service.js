// exports
exports.createPlayers = createPlayers;
exports.findLastWinner = findLastWinner;

// imports
const Player = require('../class/Player.js');
const whiteCardService = require('./whiteCard.service.js');
const utilService = require('./utils.service.js');

// functions
function createPlayers(voiceChannel, cardList) {
    const playerList = [];

    // TODO : erreur channel vide
    // TODO : erreur minimum de joueur
    // TODO : property : minimum number of players

    // creating list of members
    for (member of voiceChannel.members) {
        const user = member[1].user
        playerList.push(new Player(user, 0, whiteCardService.dealingCards(10, cardList), false));
        // TODO : property : number of cards at the begining
    }

    // choosing first player
    const playerNumber = utilService.getRandomInt(playerList.length);
    playerList[playerNumber].lastWinner = true;
    sendCardsMessages(playerList);
    // console.log(playerList);
    // TODO : erreur si player list undefined or null
    return playerList;
}

function findLastWinner(playerList) {
    return playerList.find((el) => el.lastWinner);
}

function sendCardsMessages(playerList) {
    for(player of playerList) {
        player.user.createDM().then(channel => channel.send(whiteCardService.getCardMessage(player.cards)));
    }
}