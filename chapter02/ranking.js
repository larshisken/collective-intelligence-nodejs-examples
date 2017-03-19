let Euclidean = require('./Euclidean');
let Pearson = require('./Pearson');
const critics = require('../recommendations');

// Returns the best matches for person from the prefs dictionary.
// Number of results and similarity function are optional params.
var topMatches = (prefs, person, n = 5, similarity = 'sim_pearson') => {
    scores = {};

    for (var pref in prefs) {
        if (!prefs.hasOwnProperty(pref))
            continue;

        if (pref !== person) {
            if (similarity === 'sim_pearson')
                scores[pref] = Pearson.sim(prefs, person, pref);

            if (similarity === 'sim_euclidean')
                scores[pref] = Euclidean.sim(prefs, person, pref);
        }
    }

    // Sort the list so the highest scores appear at the top
    ranking = Object.keys(scores).sort((a, b) => {
        return scores[b] - scores[a];
    });
    ranking = ranking.map(obj => {
        let rObj = {};
        rObj[obj] = scores[obj];
        return rObj;
    });
    ranking.length = n;

    return ranking;
}

console.log(topMatches(critics, 'Toby', 3, 'sim_pearson'));
