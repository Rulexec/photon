var connect = require('connect');

module.exports = photon;

function photon() {
    var c = connect.apply(null, arguments);

    c.extend = function(extension) {
        return extension.call(this), this;
    };

    return c;
}
