var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        // If anything gets wrong we do want respond and we are not calling next() in the Middleware because we dont
        // want to run next code when authentication failed.
        res.status(401).send(); // 401 - Authentication Required
    });
};

module.exports = {authenticate};