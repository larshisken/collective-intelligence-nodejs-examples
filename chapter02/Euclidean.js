module.exports = class Euclidean {

    // Returns a distance-based similarity score for person1 and person2
    static sim(prefs, person1, person2) {

        // Get the list of shared_items
        let si = prefs[person1].filter(item => {
            let m = prefs[person2].some(el => {
                return el[Object.keys(item)[0]];
            })
            if (m) return true;
        });

        // If they have no ratings in common, return 0
        if (si.length === 0) return 0;

        // Add up the squares of all the differences
        let sum = 0;
        prefs[person1].forEach(item => {
            let m = prefs[person2].some(el => {
                return el[Object.keys(item)[0]]
            });

            if (m) {
                let person2_pref = prefs[person2].find(el => {
                    if (el[Object.keys(item)[0]]) return true;
                })
                let calc = Math.pow(item[Object.keys(item)[0]] - person2_pref[Object.keys(item)[0]], 2);
                sum += calc;
            }
        });
        return 1 / (1 + sum);

    }

}
