var photon = require('photon');

var app = photon(
).use(photon.common()
).extend(photon.routing());

function text(str) {
    return function(req, res) {
        res.end(str);
    };
}
app.routeStatic({
    '/': {
        'GET': text('index')
    },
    '/test/page': text('test passed'),

    '/status/location': function(req, res) {
        res.status(302).location('/redirected').end();
    },

    '/try/redirect': function(req, res) {
        res.redirect(302, '/redirected').end();
    },

    '/redirected': text('yep!')
});

// GET /test/(\d+)
app.get(/^\/test\/(\d+)$/, function(req, res, number) {
    res.end(number);
});

// GET /test/\d
app.get(/^\/test\/\d$/, function(req, res) {
    res.end('cannot happen, because of order :|');
});

// GET /test/dynamic
app.get(/^\/test\/dynamic$/, function(req, res) {
    res.end('also not possible, because static routes');
});

// overriding dynamic route /test/dynamic by static.
// GET /test/dynamic
app.get('/test/dynamic', function(req, res) {
    res.end('No, it\'s static!');
});

app.listen(3000);
