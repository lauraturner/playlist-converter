var appleSearch = require('./appleSearch');

module.exports = {
    // Create and check that the Apple JWT works, return to
    // add the JWT in the response header
    getAppleAuthToken: async function () {
        const token = appleSearch.createAppleJWT();
        const status = await appleSearch.checkAppleToken(token)     
        if (status == 200) {
            return token;
        } else {
            throw new Error(status);
        }
    },
}