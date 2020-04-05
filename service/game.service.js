
// exports
exports.createGame = createGame;
exports.getGame = getGame;
exports.getMessageGameCreated = getMessageGameCreated;
// imports
const Game = require('../class/Game.js');
const blackCardService = require('./blackCard.service.js');
const whiteCardService = require('./whiteCard.service.js');
const playerService = require('./player.service.js');

// functions
function createGame(msg) {
    const messageParts = msg.content.split(' ');
    const options = messageParts.splice(0,2);

    // TODO : erreur gérer les erreurs des options

    // TODO : erreur si il y a déjà une partie en cours sur ce channel text

    const language = 'fr';
    const hardcore = false;
    const voiceChannelName = 'over-the-limit';

    const voiceChannel = findVoiceChannel(msg, voiceChannelName);

    // TODO : erreur si le voiceChannel n'existe pas

    const whiteCardList = whiteCardService.getWhiteCardList(language, hardcore); // TODO : erreur, c'est vide
    const blackCardList = blackCardService.getBlackCardList(language, hardcore); // TODO : erreur, c'est vide

    const playerList = playerService.createPlayers(voiceChannel, whiteCardList);

    // TODO : erreur gérer celles qui viennent de playerList

    let newGame = new Game(msg.channel.id, voiceChannel.id, playerList, whiteCardList, blackCardList);

    // console.log(newGame);
    return newGame;
  }

  function getGame(gameList, channelId) {
    return gameList.find((el) => el.channelId === channelId);
  }

  function findVoiceChannel(msg, voiceChannelName) {
    for(channel of msg.channel.guild.channels.cache) {
      if(channel[1].type === 'voice' && channel[1].name === voiceChannelName) {
        return channel[1];
      }
    }
    return;
  }

  function getMessageGameCreated(game) {
    let message = 'Partie créée avec les joueurs : \n' 
    for(const player of game.playerList) {
      message += player.user.username + '\n';
    }

    const firstJuge = playerService.findLastWinner(game.playerList).user.username;

    message += '\nle premier à juger sera ' + firstJuge + ' il ne pourra pas jouer de carte au prochain tour';

    return message;
  }
  