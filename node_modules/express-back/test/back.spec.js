var supertest = require('supertest');
var app = require('express')();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var back = require('../');

/**
 * Express Test app
 */

app.use(cookieParser());
app.use(session({
  secret: 'super secret'
}));
app.use(back());

var handler = function(req, res) {
  res.end('test');
};

app.get('/', handler);
app.get('/one', handler);
app.get('/two', function(req, res) {
  res.back();
});

app.listen(8000);

var agent = supertest.agent(app);

describe('express-back', function() {

  // get a session going
  before(function(done) {
    agent.get('/').expect(200, function(err, res) {
      if (err) return done(err);
      agent.saveCookies(res);
      done();
    });
  });

  it('should provide path tracking through sessions', function(done) {
    agent.get('/one').expect(200, function(err, res) {
      if (err) done(err);
      agent.get('/two')
        .expect('Location', '/one')
        .expect(302, done);
    });
  })
})