## express-back
The http referer header is unreliable, express-back uses sessions to track the two previous paths a client has visited. Also provides a convienence method `res.back()` to safely redirect to the previous path or fallback as to prevent a redirect loop.

### Usage
```js

var back = require('express-back');

app.use(session({
  secret: 'super secret'
}));
app.use(back());

app.get('/protected', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.back();
  }
});
```

### API
```js
var back = require('express-back');
```
This middleware depends upon a session middleware or `req.session`, and will populate `req.prevPath` and `req.prevPrevPath`.

#### back(options)
* options {Object}
* options.default {String} The fallback path to populate req.prevPath and req.prevPrevPath, defaults to '/'
