const Command = require ('../class/Command.js');
// Don't forget to add in command-list.js
exports.HELP = new Command('help', ['h', 'aide'], [], 'Display the information about Over the Limit');
exports.START = new Command('start', ['s', 'debut'], ['mode | soft', 'language | french', 'vocal channel | over-the-limit'], 'Start the game');
exports.SCORE = new Command('score', ['sc'], [], 'Print the score of the current game');
exports.END = new Command('end', ['e', 'fin'], [], 'End the game, choses the winner');
exports.PLAY = new Command('play', ['p', 'jouer'], ['Card number'], 'Play a card');
exports.CHOOSE = new Command('choose', ['c', 'choix'], ['Card number'], 'Choose the winner');
