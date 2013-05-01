module.exports = function(type, charset) {
    return function(req, res, next) {
        res.mime = function(type, charset) {
            if (charset === undefined) {
                type = 'text/html';
                charset = 'utf-8';
            }

            res.setHeader('Content-Type', type + '; charset=' + charset);

            return res;
        };

        if (type !== undefined || charset !== undefined) {
            old = res.end;
            res.end = function() {
                if (!res.getHeader('Content-Type')) {
                    res.mime(type, charset);
                }

                old.apply(res, arguments);
            };
        }

        next();
    };
};
