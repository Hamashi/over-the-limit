module.exports = function () {
    this.playedCardList = [];
    this.winner;
    this.phase = PHASE_PLAY
}


const PHASE_PLAY = 'PLAY';
exports.PHASE_CHOICE = 'CHOICE'