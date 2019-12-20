const express = require('express'),
  router = express.Router(),
  mongo = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/twitter';

mongo.connect(url, (err, client) => {
  if (err) {
    console.error(err);
    return
  }
  console.log('Connected to MongoDB');
  const db = client.db('twitter') ;
  
  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
  router.post('/login', (req, res, next) => {
    // req.body.login
    // req.body.password
    
    // vérifie les login & password
    db.collection('users').findOne({
      $and:[
        {password : req.body.password},
        {$or:[
          {email : req.body.login},
          {username : req.body.login}
        ]}]}, (err, resp) => {
      if (err) throw err ;
      if(resp && resp._id) {
        // Create COOKIES !
        req.session.user = resp ;
        // console.log('debug Session', req.session.user)
        res.cookie('loggedIn', req.session.user.username) ;
        res.send('user.login') ;
      } else {
        req.session.destroy() ;
        res.cookie('loggedIn', '') ;
        res.send('user.login.error') ;
      }
    })
  });
  router.post('/create', (req, res, next) => {
    // req.body.username
    // req.body.email
    // req.body.password
    
    // ajout un utilisateur en BDD
    db.collection('users').insertOne(req.body, (err, resp) => {
      if(resp.insertedId) {
        req.session.user = req.body ;
        res.cookie('loggedIn', req.session.user.username) ;
        res.send('user.login') ;
      } else {
        req.session.destroy();
        res.cookie('loggedIn', '') ;
        res.send('user.login.error');
      }
    })
  });
  router.delete('/logout', (req, res, next) => {
      req.session.destroy();
      res.cookie('loggedIn', '') ;
      res.send('user.logout');
  });
  
})

module.exports = router;

