function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const samples = [

];

const labels = [

];

const orderedData = samples.map((sample,index) => {
    return {
        input: sample,
        output: labels[index]
    }
});

const shuffledData = shuffle(orderedData);

exports.DATA = shuffledData;
