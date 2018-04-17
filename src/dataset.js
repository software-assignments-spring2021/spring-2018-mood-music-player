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
  // Fight Like a Girl by Zolita
  // Flames by David Guetta, Sia
  // Call Out My Name by The Weekend
  // Tequila by Dan + Shay
  // Playinwitme (feat. Kehlani) by KYLE, Kehlani
  // Sober Up by AJR, Rivers Cuomo
  // Marry Me by THomas Rhett
  // Chasing Fire by Lauv
  // Say Something by Justin Timberlake, Chris Stapleton
  // Home with You by Madison Beer
  // Everyday by Logic, Marshmello
  // Everybody Hates Me by The Chainsmokers
  // I Took A Pill In Ibiza - Seeb Remix by Mike Posner, Seeb
  // Nothing to Regret by Robinson
  // Love Lies by Khalid, Normani
  // One Kiss (with Dua Lipa) by Calvin Harris, Dua Lipa
  // The Middle by Zedd, Maren Morris, Grey
  // Turn Me On by Kevin Lyttle
  // Somebody That I Used to Know by Gotye, Kimbra
  // Cotton Eye Joe by Rednex
  // Who Let the Dogs Out by 
  // Billionare by Travis McCoy, Bruno Mars
  // Butterfly by Crazy Town
  // Sweet Disposition by The Temper Trap
  // My Sharona by The Knack
  // Jerk It Out by Caesars
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 
];

const labels = [
  {energy_level: .75, valence_level: .6825},
  {energy_level: .84375, valence_level: .75},
  {energy_level: .4375, valence_level: .3 75},
  {energy_level: .21875, valence_level: .56875},
  {energy_level: .78125, valence_level: .5},
  {energy_level: .8125, valence_level: .5625},
  {energy_level: .25, valence_level: .53125},
  {energy_level: .71875, valence_level: .53125},
  {energy_level: .6875, valence_level: .625},
  {energy_level: .71875, valence_level: .15625},
  {energy_level: .6875, valence_level: .5},
  {energy_level: .65625, valence_level: .2812},
  {energy_level: .6875, valence_level: .2812},
  {energy_level: .4375, valence_level: .3125},
  {energy_level: .34375, valence_level: .375},
  {energy_level: .78125, valence_level: .625},
  {energy_level: .71875, valence_level: .75},
  {energy_level: .6875, valence_level: .5625},
  {energy_level: .28125, valence_level: .21875},
  {energy_level: .9375, valence_level: .6875},
  {energy_level: 1, valence_level: .6875},
  {energy_level: .65625, valence_level: .875},
  {energy_level: .65625, valence_level: .4375},
  {energy_level: .40625, valence_level: .53125},
  {energy_level: .875, valence_level: .59375},
  {energy_level: .53125, valence_level: .46875},
  // {energy_level: ., valence_level: .},
  // {energy_level: ., valence_level: .},
  // {energy_level: ., valence_level: .},
  // {energy_level: ., valence_level: .},
  // {energy_level: ., valence_level: .},
  // {energy_level: ., valence_level: .},
  // {energy_level: ., valence_level: .},
];

const orderedData = samples.map((sample,index) => {
    return {
        input: sample,
        output: labels[index]
    }
});

const shuffledData = shuffle(orderedData);

exports.DATA = shuffledData;
