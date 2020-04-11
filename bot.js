// IMPORTS
// Run dotenv
require('dotenv').config();
// CONSTS
const TRIGGER_COMMAND = '/otl'
const COMMAND_LIST = require('./consts/command-list.const.js');
const COMMAND = require('./consts/command.const.js');
const ERROR_LIST = require('./consts/error-list.const.js');
const ERROR_CODES = require('./consts/error-codes.const.js');
// discord
const Discord = require('discord.js');
const client = new Discord.Client();
// services
const helpService = require('./service/help.service.js');
const gameService = require('./service/game.service.js');
const playerService = require('./service/player.service.js');
const blackCardService = require('./service/blackCard.service.js');
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
    let cardNumber;
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
      break;
      case COMMAND.END : 
        game = gameService.getGame(gameList, msg.channel.id);
        // TODO : erreur si on ne trouve pas la game
        game.lastTurn = true;
        msg.reply('Ce tour de jeu sera le dernier.');
      break;
      case COMMAND.PLAY :
        // TODO : erreur si celui qui choisit le plus drôle joue
        // TODO : erreur si il a déjà joué
        game = gameService.getGame(gameList, msg.channel.id);
        // TODO : erreur si on ne trouve pas la game
        cardNumber = parseInt(messageParts[2], 10);
        // TODO : erreur si l'argument est incorrect (pas un chiffre entre 0 et 9 inclus)
        gameService.playCard(msg, game, cardNumber);
      break;
      case COMMAND.SCORE :
        game = gameService.getGame(gameList, msg.channel.id);
        // TODO : erreur si on ne trouve pas la game

        const scoreMessage = gameService.getScoreMessage(game.playerList);
        msg.reply(scoreMessage);
      break;
      case COMMAND.CHOOSE :
        // TODO : erreur si quelqu'un n'a pas le droit de choisir
        // TODO : erreur si c'est pas la bonne phase du tour
        game = gameService.getGame(gameList, msg.channel.id);
        // TODO : erreur si on ne trouve pas la game
        cardNumber = parseInt(messageParts[2], 10);
        // TODO : erreur si l'argument est incorrect (pas un chiffre entre 0 et et le nombre de joueurs-1)

        gameService.chooseCard(game, cardNumber);
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
  const message = ERROR_LIST.find(el => el.code === code).message

  if(!message) {
    return 'Unknown Error';
  }

  return message;
}

async function gameTurn(msg, game) {
  playerService.sendCardsMessages(game.playerList);
  game.turn = new Turn();
  const blackCard = blackCardService.drawBlackCard(game.blackCardList);
  let message = 'Début du tour de jeu, ' + playerService.findLastWinner(game.playerList).user.username + ' va décider de qui a été le plus drôle.\n';
  message += 'La phrase à compléter est "' + blackCardService.replaceTextBlackCard(blackCard, '____________') + '" vous avez 1m30 pour jouer';
  // TODO : property '____________'
  await msg.channel.send(message);

  setTimeout(async () => {
    const messageFin = 'Fin du tour de jeu voici les cartes qui ont été jouées : ';

    await msg.channel.send(messageFin);

    for (let i = 0; i<game.turn.playedCardList.length; i++) {
      const whiteCard = game.turn.playedCardList[i].card;

      const messageCarte = i + '. ' + blackCardService.replaceTextBlackCard(blackCard, whiteCard.text);

      await msg.channel.send(messageCarte);
    }
    game.turn.phase = Turn.PHASE_CHOICE;
    setTimeout(() => {
      if(!game.lastTurn) {
          gameTurn(msg, game);
      } else {
        // TODO : détruire la game
        const scoreMessage = gameService.getScoreMessage(game.playerList);
        msg.channel.send(scoreMessage);

        this.gameList = this.gameList.filter((el) => el.textualChannelId != game.textualChannelId);
      }
      
    }, 15000);
  // TODO : property temps
  }, 30000);
  // TODO : property temps
}
