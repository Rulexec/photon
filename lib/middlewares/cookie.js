module.exports = function(options) {
    return function(req, res, next) {
        var cookies = {};

        res.cookie = function(name, value, options) {
            options === undefined && (options = {});
            var maxAge = options.maxAge,
                expires = options.expires ||
                    (maxAge ? new Date(Date.now() + maxAge * 1000) : undefined),
                httpOnly = options.httpOnly !== undefined ?
                    options.httpOnly : true,
                path = options.path !== undefined ?
                    options.path : '/';

            cookies[name] = {
                value: value,
                httpOnly: httpOnly,
                expires: expires,
                path: path
            };
        };
        
        var old = res.end;
        res.end = function() {
            var cooked = [];

            for (var name in cookies) if (cookies.hasOwnProperty(name)) {
                cooked.push(toStr(name, cookies[name]));
            }

            res.setHeader('Set-Cookie', cooked);

            old.apply(res, arguments);
        };

        function toStr(name, cookie) {
            return name + '=' + cookie.value +
                (cookie.expires ? '; Expires=' + cookie.expires.toUTCString() : '') +
                '; Path=' + cookie.path +
                (cookie.httpOnly ? '; HttpOnly' : '');
        }
        
        next();
    };
};
