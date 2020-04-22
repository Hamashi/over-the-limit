// IMPORTS
// Run dotenv
require('dotenv').config();
// CONSTS
const TRIGGER_COMMAND = '/otl'
const COMMAND_LIST = require('./consts/command-list.const.js');
const COMMAND = require('./consts/command.const.js');
const ERROR_LIST = require('./consts/error-list.const.js');
const ERROR_CODES = require('./consts/error-codes.const.js');
const PROPERTIES = require('./properties.js');
// discord
const Discord = require('discord.js');
const client = new Discord.Client();
// services
const helpService = require('./service/help.service.js');
const gameService = require('./service/game.service.js');
const playerService = require('./service/player.service.js');
const blackCardService = require('./service/blackCard.service.js');
const utilsService = require('./service/utils.service.js');
// classes
const Turn = require('./class/Turn.js');
// END IMPORTS

// variables
gameList = [];

// events
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

client.on('message', msg => {
  const messageParts = msg.content.split(' ');

  if (messageParts[0] === TRIGGER_COMMAND) {
    const commandOjb = findCommand(messageParts[1]);
    let game;
    switch(commandOjb) {
      case COMMAND.HELP : 
      msg.reply(helpService.createHelpMessage());
      break;
      case COMMAND.START :
        const newGame = gameService.createGame(msg, gameList);
        if(newGame.error) {
          msg.reply(getErrorMessage(newGame.error));
          return;
        }
        gameList.push(newGame);
        msg.reply(gameService.getMessageGameCreated(newGame));
        gameTurn(msg, newGame);
        // TODO : laisser du temps au startup
      break;
      case COMMAND.END : 
        game = gameService.getGame(gameList, msg.channel.id);
        if(!game) {
          msg.reply(getErrorMessage(ERROR_CODES.GAME_NOT_FOUND));
          return;
        }
        game.lastTurn = true;
        msg.reply('Ce tour de jeu sera le dernier.');
      break;
      case COMMAND.PLAY :
        game = gameService.getGame(gameList, msg.channel.id);
        if(!game) {
          msg.reply(getErrorMessage(ERROR_CODES.GAME_NOT_FOUND));
          return;
        }
        const player = playerService.findPlayerById(game.playerList, msg.author.id);
        if(!player) {
          msg.reply(getErrorMessage(ERROR_CODES.PLAYER_NOT_FOUND));
          return;
        }
        if(player.lastWinner || playerService.isAlreadyPlayed(game.turn.playedCardList, msg.author.id)) {
          msg.reply(getErrorMessage(ERROR_CODES.PLAYER_NOT_ALLOWED));
          return;
        }
        const cardNumber = parseInt(messageParts[2], 10);
        if(cardNumber >= PROPERTIES.CARD_NUMBER || isNaN(cardNumber)) {
          msg.reply(getErrorMessage(ERROR_CODES.INVALID_ARGUMENT));
          return;
        }
        gameService.playCard(msg, game, cardNumber);
      break;
      case COMMAND.SCORE :
        game = gameService.getGame(gameList, msg.channel.id);
        if(!game) {
          msg.reply(getErrorMessage(ERROR_CODES.GAME_NOT_FOUND));
          return;
        }
        const scoreMessage = gameService.getScoreMessage(game.playerList);
        msg.reply(scoreMessage);
      break;
      case COMMAND.CHOOSE :

        game = gameService.getGame(gameList, msg.channel.id);
        if(!game) {
          msg.reply(getErrorMessage(ERROR_CODES.GAME_NOT_FOUND));
          return;
        }
        const chooser = playerService.findPlayerById(game.playerList, msg.author.id);
        if (!chooser.lastWinner) {
          msg.reply(getErrorMessage(ERROR_CODES.PLAYER_NOT_ALLOWED));
          return;
        }
        if (game.turn.phase !== Turn.PHASE_CHOICE) {
          msg.reply(getErrorMessage(ERROR_CODES.COMMAND_NOT_ALLOWED));
          return;
        }
        const playedCardNumber = parseInt(messageParts[2], 10);
        if(playedCardNumber >= game.turn.playedCardList.length || isNaN(cardNumber)) {
          msg.reply(getErrorMessage(ERROR_CODES.INVALID_ARGUMENT));
          return;
        }

        gameService.chooseCard(game,playedCardNumber);
      break;
      default : 
        msg.reply(getErrorMessage(ERROR_CODES.INVALID_COMMAND));
      return;
    }
  }
});

// functions
function findCommand(commandStr) {
  if(!commandStr) {
    return null;
  }
  const commandObj = COMMAND_LIST.find(el => el.name === commandStr || el.aliasList.includes(commandStr));
  return commandObj;
}

function getErrorMessage(code) {
  const message = ERROR_LIST.find(el => el.code === code);

  if(!message) {
    return code;
  }

  return message.message;
}

async function gameTurn(msg, game) {
  playerService.sendCardsMessages(game.playerList);
  game.turn = new Turn();
  const blackCard = blackCardService.drawBlackCard(game.blackCardList);
  let message = 'Début du tour de jeu, ' + playerService.findLastWinner(game.playerList).user.username + ' va décider de qui a été le plus drôle.\n';
  message += 'La phrase à compléter est "' + blackCardService.replaceTextBlackCard(blackCard, PROPERTIES.NEUTRAL_TEXT) + '" vous avez 1m30 pour jouer';

  await msg.channel.send(message);

  // TODO : si tout le monde a joué, on passe à la suite
  setTimeout(async () => {
    const messageFin = 'Fin du tour de jeu voici les cartes qui ont été jouées : ';

    await msg.channel.send(messageFin);
    utilsService.shuffle(game.turn.playedCardList);
    for (let i = 0; i<game.turn.playedCardList.length; i++) {
      const whiteCard = game.turn.playedCardList[i].card;
      
      const messageCarte = i + '. ' + blackCardService.replaceTextBlackCard(blackCard, whiteCard.text);

      await msg.channel.send(messageCarte);
    }
    game.turn.phase = Turn.PHASE_CHOICE;
    setTimeout(() => {
      // TODO : si personne n'a gagné on lance un vote général
      if(!game.lastTurn) {
          gameTurn(msg, game);
          return;
      } else {
        const scoreMessage = gameService.getScoreMessage(game.playerList);
        msg.channel.send(scoreMessage);

        this.gameList = this.gameList.filter((el) => el.textualChannelId != game.textualChannelId);
      }
      
    }, PROPERTIES.DURATION_CHOOSE);
  }, PROPERTIES.DURATION_TURN);
}
