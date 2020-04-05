
// exports
exports.createHelpMessage = createHelpMessage;

// imports
const COMMAND_LIST = require('../consts/command-list.const.js');

// functions
function createHelpMessage() {
    let helpMessage = 'Liste des commandes disponibles :\n';
    
    for(const command of COMMAND_LIST) {
      helpMessage += command.name;
  
      if(command.aliasList && command.aliasList.length) { // adding aliases
        helpMessage += ' (';
        let first = true;
        for(alias of command.aliasList){
          if(!first) {
            helpMessage += ', ';
          }
          first = false;
          helpMessage += alias;
        }
        helpMessage += ') ';
      }
  
      if(command.argList && command.argList.length) { // adding args
        for(const arg of command.argList) {
          helpMessage += ' < ' + arg + ' > ';
        }
      }
  
      helpMessage += '\n' + command.description + '\n\n'
    }
  
    // TODO : règles du jeu
    // TODO : comment jouer
    return helpMessage;
  }
  