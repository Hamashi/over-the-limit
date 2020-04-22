
// exports
exports.createGame = createGame;
exports.getGame = getGame;
exports.getMessageGameCreated = getMessageGameCreated;
exports.playCard = playCard;
exports.chooseCard = chooseCard;
exports.getScoreMessage = getScoreMessage;
// imports
const ERROR_CODES = require('../consts/error-codes.const.js');
const Game = require('../class/Game.js');
const blackCardService = require('./blackCard.service.js');
const whiteCardService = require('./whiteCard.service.js');
const playerService = require('./player.service.js');
const PlayedCard = require('../class/PlayedCard');

// functions
function createGame(msg, gameList) {
    // const messageParts = msg.content.split(' ');
    // const options = messageParts.splice(0,2);

    // TODO : erreur gérer les erreurs des options

    const gameExists =  !!gameList.find(el => el.textualChannelId === msg.channel.id);
    if(gameExists) {
      let error = { error: ERROR_CODES.GAME_ALREADY_EXISTS };
      return error;
    }

    const language = 'fr';
    const hardcore = false;
    const voiceChannelName = 'over-the-limit';

    const voiceChannel = findVoiceChannel(msg, voiceChannelName);

    if(!voiceChannel) {
      let error = { error: ERROR_CODES.VOICECHANNEL_NOT_FOUND };
      return error;
    }
    const whiteCardList = whiteCardService.getWhiteCardList(language, hardcore);
    const blackCardList = blackCardService.getBlackCardList(language, hardcore);

    const playerList = playerService.createPlayers(voiceChannel, whiteCardList);

    if(!playerList || !blackCardList || !whiteCardList) {
      let error = { error: ERROR_CODES.UNKNOWN_ERROR };
      return error;
    }

    let newGame = new Game(msg.channel.id, voiceChannel.id, playerList, whiteCardList, blackCardList);
    if(newGame) {
      let error = { error: ERROR_CODES.UNKNOWN_ERROR };
      return error;
    }

    return newGame;
  }

  function getGame(gameList, channelId) {
    return gameList.find((el) => el.textualChannelId === channelId);
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
  
  function playCard(msg, game, cardNumber) {
    const player = playerService.findPlayerById(game.playerList, msg.author.id);
    game.turn.playedCardList.push(new PlayedCard(player, player.cardList[cardNumber]));

    player.cardList.splice(cardNumber, 1);
    const drawnCardList = whiteCardService.dealingCards(1, game.whiteCardList);

    for(const drawnCard of drawnCardList) {
      player.cardList.push(drawnCard);
    }
  }

  function chooseCard(game, cardNumber) {
    playerService.findLastWinner(game.playerList).lastWinner = false;
    const playedCard = game.turn.playedCardList[cardNumber];
    playedCard.player.lastWinner = true;
    playedCard.player.score ++;
  }

  function getScoreMessage(playerList) {
    let message = 'Voici les scores de la partie :\n';
    playerList.sort((a, b) => b.score - a.score);

    for(const player of playerList) {
      message += player.user.username + ' : ' + player.score + ' points\n';
    }

    return message;
  }