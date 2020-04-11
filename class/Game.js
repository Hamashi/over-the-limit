// exports
const Turn = require('./Turn.js');

module.exports = function (textualChannelId, vocalChannel, playerList, whiteCardList, blackCardList) {
        this.textualChannelId = textualChannelId;
        this.vocalChannel = vocalChannel;
        this.playerList = playerList;
        this.whiteCardList = whiteCardList;
        this.blackCardList = blackCardList;
        this.lastTurn = false;
        this.turn = new Turn();
}
