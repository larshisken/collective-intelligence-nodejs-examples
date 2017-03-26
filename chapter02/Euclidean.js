const _ = require('lodash');

module.exports = class Euclidean {

    // Returns a distance-based similarity score for person1 and person2
    static sim(prefs, person1, person2) {

        // Get the list of shared_items
        let person1Movies = _.map(prefs[person1], (n) => {
            return _.keys(n)[0];
        });
        let person2Movies = _.map(prefs[person2], (n) => {
            return _.keys(n)[0];
        });
        let sharedMovies = _.intersection(person1Movies, person2Movies);

        // If they have no ratings in common, return 0
        if (sharedMovies.length === 0) return 0;

        // Add up the squares of all the differences
        let sum = 0;
        _.forEach(sharedMovies, (value) => {

            let person1Rating = _.values(_.find(prefs[person1], (e) => {
                if (e[value]) return e[value];
            }))[0];
            let person2Rating = _.values(_.find(prefs[person2], (e) => {
                if (e[value]) return e[value];
            }))[0];

            let calc = Math.pow(person1Rating - person2Rating, 2);
            sum += calc;
        });

        return 1 / (1 + sum);

    }

}
