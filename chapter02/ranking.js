let Euclidean = require('./Euclidean');
let Pearson = require('./Pearson');
const critics = require('../recommendations');

// Returns the best matches for person from the prefs dictionary.
// Number of results and similarity function are optional params.
let topMatches = (prefs, person, n = 5, similarity = 'sim_pearson') => {
    let scores = {};

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

// Gets recommendations for a person by using a weighted average
// of every other user's rankings
let getRecommendations = (prefs, person, similarity = 'sim_pearson') => {
    let totals = {};
    let simSums = {};

    for (other in prefs) {
        if (!prefs.hasOwnProperty(other)) continue;

        // Don't compare me to myself
        if (other === person) continue;

        let sim;
        if (similarity === 'sim_pearson')
            sim = Pearson.sim(prefs, person, other);
        if (similarity === 'sim_euclidean')
            sim = Euclidean.sim(prefs, person, other);

        // Ignore scores of zero or lower
        if (sim <= 0) continue;

        prefs[other].forEach(item => {

            let key = Object.keys(item)[0];

            // only score movies I haven't seen yet
            let m = prefs[person].some(el => {
                if (el[key]) return true;
            });

            if (!m) {
                // Similarity * Score
                if (totals[key] === undefined) totals[key] = 0;
                totals[key] += item[key] * sim;

                // Sum of similarities
                if (simSums[key] === undefined) simSums[key] = 0;
                simSums[key] += sim;
            }
        });
    }

    // Create the normalized list
    let scores = Object.keys(totals).map(key => {
        let rObj = {};
        rObj[key] = totals[key] / simSums[key];
        return rObj;
    });
    let ranking = scores.sort((a, b) => {
        return b[Object.keys(b)[0]] - a[Object.keys(a)[0]];
    });

    // Return the sorted list
    return ranking;

}

console.log(topMatches(critics, 'Toby', 3));
console.log(getRecommendations(critics, 'Toby'));
