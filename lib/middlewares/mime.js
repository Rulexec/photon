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
            res.mime(type, charset);
        }

        next();
    };
};
