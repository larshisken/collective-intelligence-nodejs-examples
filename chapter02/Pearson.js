const critics = require('../recommendations');

let Pearson = class Pearson {

    // Returns the Pearson correlation coefficient for p1 and p2
    static sim(prefs, person1, person2) {

        // Get the list of mutually rated items
        let si = prefs[person1].filter(item => {
            let m = prefs[person2].some(el => {
                return el[Object.keys(item)[0]];
            })
            if (m) return true;
        });

        // If they are no ratings in common, return 0
        if (si.length === 0) return 0;

        let sum1 = 0;
        let sum1Sq = 0;
        let sum2 = 0;
        let sum2Sq = 0;
        let pSum = 0;

        si.forEach(sip1 => {

            let key = Object.keys(sip1)[0];
            let sip2 = prefs[person2].find(el => {
                if (el[key]) return true;
            });

            // Add up all the preferences
            sum1 += sip1[key];
            sum2 += sip2[key];

            // Sum up the squares
            sum1Sq += Math.pow(sip1[key], 2);
            sum2Sq += Math.pow(sip2[key], 2);

            // Sum up the products
            pSum += sip1[key] * sip2[key];

        });

        let num = pSum - (sum1 * sum2 / si.length);
        let den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / si.length) * (sum2Sq - Math.pow(sum2, 2) / si.length));

        if (den === 0) return 0;

        return num / den;

    }

}

module.exports = Pearson;

console.log(Pearson.sim(critics, 'Lisa Rose', 'Gene Seymour'));
