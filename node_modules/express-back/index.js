/**
 * express-back
 */

var Response = require('http').ServerResponse;

/**
 * Redirects to `req.prevPath`, `req.prevPrevPath`, or `/`. Prefers `req.prevPath` but
 * falls back to `req.prevPrevPath` or `/` if either will cause a redirect loop.
 */

Response.prototype.back = function() {
  var req = this.req;
  var redirect = req.prevPath;
  if (req.prevPath && req.path === req.prevPath) {
    redirect = req.prevPrevPath && req.path !== req.prevPrevPath
      ? req.prevPrevPath
      : '/';
  }
  return this.redirect(redirect);
};

/**
 * Tracks the two previous paths in a session.
 * @param {Object} [options = {}] Options
 * @param {String} [options.default = '/'] The default path to populate `req.prevPath` and `req.prevPrevPath` on first request.
 */

function back(options) {
  options = options || {};
  var defaultPath = options.default || '/';

  return function(req, res, next) {
    if (!req.session) {
      return next(new Error('sessions are required for `express-back`'));
    }
    var _end = res.end;
    var currentPath = req.path;
    var session = req.session;
    req.prevPrevPath = session.prevPrevPath || defaultPath;
    req.prevPath = session.prevPath || defaultPath;

    res.end = function(chunk, encoding) {
      session.prevPrevPath = session.prevPath;
      session.prevPath = currentPath;
      _end.call(res, chunk, encoding);
    };
    next();
  }
}

module.exports = back;