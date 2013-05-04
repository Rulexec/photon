var connect = require('connect');

exports = module.exports = require('./lib/photon');

// extensions
['routing'
].forEach(function(extension) {
    exports[extension] = require('./lib/extensions/' + extension);
});

// middlewares
['common', 'decodeURI', 'mime', 'cookie', 'auth', 'session', 'path'
].forEach(function(middleware) {
    exports[middleware] = require('./lib/middlewares/' + middleware);
});

// from connect
['cookieParser', 'urlencoded'
].forEach(function(middleware) {
    exports[middleware] = connect[middleware];
});
