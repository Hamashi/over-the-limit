const Error = require('../class/Error.js');
const ERROR_CODES = require('./error-codes.const.js');
module.exports = [
    new Error(ERROR_CODES.INVALID_COMMAND, 'Invalid command, type /otl help for more information'),
    new Error(ERROR_CODES.GAME_ALREADY_EXISTS, 'A game already exists on this textual channel'),
    new Error(ERROR_CODES.NOT_ENOUGH_PLAYERS, 'Not enough players on vocal channel to launch a game'),
]
