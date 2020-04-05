// exports
exports.getBlackCardList = getBlackCardList;

// imports
const BLACK_CARDS = require('../consts/black-cards.const.js');

// functions
function getBlackCardList(language, hardcore) {
    return BLACK_CARDS.filter( (el) => ( el.language === language || el.language === 'all' ) && el.hardcore === hardcore);
}