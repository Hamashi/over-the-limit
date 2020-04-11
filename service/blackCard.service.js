// exports
exports.getBlackCardList = getBlackCardList;
exports.drawBlackCard = drawBlackCard;
exports.replaceTextBlackCard = replaceTextBlackCard;

// imports
const BLACK_CARDS = require('../consts/black-cards.const.js');
const PROPERTIES = require('../properties.js');
const utilsService = require('./utils.service.js');

// functions
function getBlackCardList(language, hardcore) {
    return BLACK_CARDS.filter( (el) => ( el.language === language || el.language === 'all' ) && el.hardcore === hardcore);
}

function drawBlackCard(blackCardList) {
    const cardNumber = utilsService.getRandomInt(blackCardList.length);
    return blackCardList[cardNumber]
}

function replaceTextBlackCard(blackCard, text) {
    return blackCard.text.replace(PROPERTIES.JOKER_CHARACTER, text);
}