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
    switch(commandOjb) {
      case COMMAND.HELP : 
      msg.reply(helpService.createHelpMessage());
      break;
      case COMMAND.START :
        const newGame = gameService.createGame(msg);
        if(!newGame || newGame.error) {
          msg.reply(newGame.error.message);
          return;
        }
        gameList.push(newGame);
        msg.reply(gameService.getMessageGameCreated(newGame));
      break;
      case COMMAND.END : 
      break;
      case COMMAND.PLAY :
      break;
      case COMMAND.SCORE :
      break;
      case COMMAND.CHOOSE :
      break;
      default : 
        msg.reply(ERROR_LIST.find(el => el.code === ERROR_CODES.INVALID_COMMAND).message);
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
