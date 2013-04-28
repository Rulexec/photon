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

Provides possibility route requests by method, request url match, or by RegExp.

**Warning:** here is two types of routes. Static (with pattern as string) and dynamic (with pattern as RegExp). And static routes have highter priority.

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

__Options__

* status, location, redirect: Boolean - enable/disable features. Default true for all.

----------------------------------------

### photon.decodeURI()

Calls decodeURIComponent to req.url for replacing '%D1%8D%D1%82%D0%BE' to unicode.

----------------------------------------

### photon.mime([[type,] charset])

If type or charset passed, sets mime type. Default type - text/html.

__Adds__
* res.mime([type,] charset) - sets mime type and charset. If type is omitted, sets text/html.

----------------------------------------

### photon.cookie()

__Adds__
* res.cookie(name, value, options) - sets cookie. Supported options is: maxAge (in seconds), expires (Date), path, httpOnly (Boolean). Expires has highter priority, than maxAge.

----------------------------------------

### photon.auth(options)

Provides generic auth mechanism. In current time allows only set and get user. Here is no backend for storing sessions. This middleware just calls your backend methods, when you need to get user object, or set it.

__Requires__
* photon.cookieParser
* photon.cookie

__Options__
* sessionApi.get(sessionId, callback(error, user))
* sessionApi.create(user, callback(error, sessionId))
* sessionApi.remove(sessionId)
* cookie - cookie name, used for store session id. Defaults to 'session_id'

__Adds__
* req.user.get(callback(error, user))
* res.user.set(user, callback(error))
* res.user.unset() - chainable. But it ignores possible error from backend.

__Extras__
* photon.auth.required(fn(req, res, user), otherwise(error, req, res)) - if Boolean(user) !== false, calls fn and passes user as third argument (if this is dynamic route, groups will follow), otherwise calls otherwise. If here backend error, calls otherwise too.
* photon.auth.fail(otherwise) - returns photon.auth.required equivalent with otherwise as default otherwise.

----------------------------------------

If you know English and can fix my errors, please, write me to [rulix.exec@gmail.com](mailto:rulix.exec@gmail.com). Thanks.
