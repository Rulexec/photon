# photon.js

Photon is just Connect, extended by method `app.extend`. And also a number of extensions and middlewares for it.

All Photon in this 7 lines:

```javascript
function photon() {
    var c = connect.apply(null, arguments);

    c.extend = function(extension) {
        return extension.call(this), this;
    };

    return c;
}
```

## Extensions
### photon.routing()

Provides possibility to route requests by method, request url match, or by RegExp.

**Warning:** here is two types of routes. Static (with pattern as string) and dynamic (with pattern as RegExp). And static routes have highter priority.

__Requires__

* photon.path

__Adds__

* app.get, app.post
* app.routeStatic

At current time I'm don't need more, than get/post handlers. If you need, ask me for it, thanks.

#### app.VERB(pattern, handler)

__Arguments__

* pattern: String | RegExp
* handler(req, res, [group1, [group2, ...]]) - will be called, if pattern is matching. Also, if RegExp pattern has groups, they will be passed as arguments. Beware, they are strings.

#### app.routeStatic(routes)

__Example__

```javascript
app.routeStatic({
  '/get/by/default': handlerA,
  '/but/other/methods/too': {
    'GET': handlerA,
    'POST': handlerB,
    'HEAD': handlerC
  }
})
```

## Middlewares
### photon.common(options)

__Adds__

* res.status(statusCode) - chainable version of res.statusCode = statusCode
* res.location(url) - shortcut for res.setHeader('Location', url)
* res.redirect([statusCode,] url) - shortcut for res.status(statusCode).location(url). Default statusCode is 303.
* res.onEnd(callback) - adds callback to stack, and when res.end called — calls every callback from stack. Callback must call this.apply(this, arguments) to continue.

__Options__

* status, location, redirect, onEnd: Boolean - enable/disable features. Default true for all.

----------------------------------------

### photon.decodeURI()

Calls decodeURIComponent to req.url for replacing '%D1%8D%D1%82%D0%BE' to unicode.

----------------------------------------

### photon.mime([type, charset])

Default type — text/html, charset — utf-8.

__Requires__

* photon.common({onEnd: true})

__Adds__

* res.mime(type, charset) - sets mime type and charset. If type or charset === null, takes value from passed options to photon.mime.

----------------------------------------

### photon.cookie()

__Requires__

* photon.common({onEnd: true});

__Adds__

* res.cookie(name, value, options) - sets cookie. Supported options is: maxAge (in seconds), expires (Date), path, httpOnly (Boolean). Expires has highter priority, than maxAge.

----------------------------------------

### photon.session(options)

Provides generic session mechanism.

__Requires__

* photon.cookieParser
* photon.cookie

__Options__

* sessionApi.read(sessionId, [key], callback(error, data))
* sessionApi.update(sessionId, [key], data, callback(error, sessionId))
* sessionApi.remove(sessionId, [key], callback(error))

__Adds__

* req.session.read([key], callback(error, data))
* res.session.set([key], data, callback(error))
* res.session.remove([key], callback(error))

----------------------------------------

### photon.auth(options)

Provides auth mechanism based on session. Will rewritten to generic version soon.

__Requires__

* photon.session

__Options__

* cookie - cookie name, used for store session id. Defaults to 'session_id'

__Adds__

* req.session:user — creates user field in session
* req.user.get(callback(error, user))
* res.user.set(user, callback(error))
* res.user.unset(callback)

__Extras__

* photon.auth.required(fn(req, res, user), otherwise(req, res, error)) - if Boolean(user) !== false, calls fn and passes user as third argument (if this is dynamic route, groups will follow), otherwise calls otherwise. If here backend error, calls otherwise too.
* photon.auth.fail(otherwise) - returns photon.auth.required equivalent with otherwise as default otherwise.
* photon.auth.provide(fn(req, res, user), error(req, res, error)) - if no error, provides user (null, if not set).
* photon.auth.provideFail(error(req, res, error)) - returns photon.auth.provide equivalent with error as default error callback.

### photon.path()

__Adds__

* req.path - req.url sliced to first '?' char

----------------------------------------

### photon.hostRedirect(host, [protocol])

If req.headers.host !== host, redirects with 302 to protocol://host.

----------------------------------------

### photon.cache()

__Adds__
* req.cached({etag: 'string', lastModified: Date}) — one of etag or lastModified options must be defined. Checks for If-Modified-Since and If-None-Match headers. If If-Modified-Since >= lastModified, or If-None-Match === etag, returns true, else false;
* res.cache({mode: 'public', maxAge: int, etag: 'string', lastModified: Date}) — sets Cache-Control: mode[, max-age=maxAge], ETag: etag, Last-Modified: lastModified. Also sets Date: new Date().toUTCString().
* res.notModified() — chainable res.statusCode = 304.
* res.endIfCached(options) — options same as in req.cached. Shortcut for return req.cached(options) ? res.notModified().end(), true : false.

----------------------------------------

If you know English and can fix my errors, please, write me to [rulix.exec@gmail.com](mailto:rulix.exec@gmail.com). Thanks.
