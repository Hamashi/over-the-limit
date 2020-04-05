const Error = require('../class/Error.js');
const ERROR_CODES = require('./error-codes.const.js');
module.exports = [
    new Error(ERROR_CODES.INVALID_COMMAND, 'Invalid command, type /otl help for more information'),
]
