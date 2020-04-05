// exports
exports.getWhiteCardList = getWhiteCardList;
exports.dealingCards = dealingCards;
exports.getCardMessage = getCardMessage;
// imports
const WHITE_CARDS = require('../consts/white-cards.const.js');
const utilsService = require('./utils.service.js');

// functions
function getWhiteCardList(language, hardcore) {
    return WHITE_CARDS.filter( (el) => ( el.language === language || el.language === 'all' ) && el.hardcore === hardcore);
}

function dealingCards(nbCards, cardList) {
    const cardsToDeal = [];
    for(let i = 0; i < nbCards; i++) {
        const cardNumber = utilsService.getRandomInt(cardList.length);
        cardsToDeal.push(cardList[cardNumber]);
    }
    return cardsToDeal;
}

function getCardMessage(cardList) {
    message = 'Voici les cartes de votre main : ';
    console.log(cardList);
    console.log(cardList.length);
    for(let i; i < cardList.length; i++) {
        message += i + '. ' + cardList[i].text;
    }

    return message;
}
