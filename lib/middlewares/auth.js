var auth = module.exports = function(options) {
    var api = options.sessionApi,
        cookieName = options.cookie || 'session_id';

    return function(req, res, next) {
        var sessionId = req.cookies[cookieName];
        var user = null;

        req.user = {};
        req.user.get = function(callback) {
            if (!sessionId) return callback(null, null);

            if (user === null) {
                api.get(sessionId, function(error, _user) {
                    if (error) return callback(error);

                    user = _user;
                    callback(null, user);
                });
            } else {
                callback(null, user);
            }
        };

        res.user = {};
        res.user.set = function(newUser, callback) {
            user = newUser;
            api.create(user, function(error, _sessionId) {
                if (error) return callback(error);

                sessionId = _sessionId;
                res.cookie(cookieName, sessionId, {httpOnly: true});

                callback();
            });
        };

        res.user.unset = function() {
            if (sessionId) {
                api.remove(sessionId);
            }

            return res;
        };

        next();
    };
};

auth.required = function(fn, otherwise) {
    return function(req, res) {
        var args = arguments;

        req.user.get(function(error, user) {
            if (error) return otherwise(error);

            if (user) {
                fn.apply(null, [req, res, user].concat(Array.prototype.slice.call(args, 2)));
            } else {
                if (otherwise) {
                    otherwise(null, req, res);
                } else {
                    res.status(403).end('403');
                }
            }
        });
    };
};
auth.fail = function(otherwise) {
    return function(fn) {
        return auth.required(fn, otherwise);
    };
}
