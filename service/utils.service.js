// exports
exports.getRandomInt = getRandomInt;
exports.shuffle = shuffle;
// functions
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }
  