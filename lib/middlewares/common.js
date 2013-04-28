module.exports = function(options) {
    options === undefined && (options = {});

    function byDefault(value, option) {
        if (option === undefined) return value;
        else return options;
    }

    var status = byDefault(true, options.status),
        location = byDefault(true, options.location),
        redirect = byDefault(true, options.redirect);

    return function(req, res, next) {
        status && (res.status = function(statusCode) {
            res.statusCode = statusCode;
            return res;
        });

        location && (res.location = function(url) {
            res.setHeader('Location', url);
            return res;
        });

        redirect && (res.redirect = function(code, url) {
            if (typeof code === 'string') {
                url = code;
                code = 303;
            }

            res.statusCode = code;
            res.setHeader('Location', url);

            return res;
        });

        next();
    };
};
