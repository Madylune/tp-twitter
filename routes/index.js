const express = require('express'),
  router = express.Router(),
  mongo = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/twitter';

mongo.connect(url, (err, client) => {
  if (err) {
    console.error(err);
    return
  }
  console.log('connected');
  const db = client.db('twitter');

  router.use(function(req, res, next) {
    if(!req.session || !req.session.user)
      res.cookie('loggedIn', '')
    next();
  });
  
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Twitter', user: req.session.user || {} });
  });
})

module.exports = router;

