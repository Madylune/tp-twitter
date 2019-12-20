const express = require('express'),
  router = express.Router(),
  mongo = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectId,
  url = 'mongodb://localhost:27017/twitter';
  sockets = require('../lib/sockets')

mongo.connect(url, (err, client) => {
  if (err) {
    console.error(err);
    return
  }
  console.log('connected');
  const db = client.db('twitter');

  router.get('/', (req, res) => {
    db.collection('tweets')
      .find({author : {$ne : req.session.user._id}})
      .sort({date:-1})
      .toArray((err, tweets) => {
        res.render('tweets', {tweets}, (err, html) => {
          res.json({response : html})
        })
    })
  })

  router.get('/:id', (req, res) => {
    db.collection('tweets')
      .findOne({author : {$ne : req.session.user._id}, _id : new ObjectId(req.params.id)}, (err, tweet) => {
        res.render('tweets', {tweets : [tweet]}, (err, html) => {
          res.json({response : html})
        })
    })
  });
  
  router.post('/', (req, res) => {
    db.collection('tweets')
      .insertOne({
        message : req.body.message,
        author : req.session.user._id,
        pseudo : req.session.user.username,
        date:new Date()}, (err, result) => {
        if(err) throw err ;
        sockets.sendAll(req.session.user._id, 'tweet', result.insertedId)
        res.send('tweet.sent')
      })
  })
})

module.exports = router;
