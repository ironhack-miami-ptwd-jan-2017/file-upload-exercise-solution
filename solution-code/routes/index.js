const express = require('express');
const Post    = require('../models/post');
const router  = express.Router();

router.get('/', (req, res, next) => {
  Post.find({}, null, { sort: '-createdAt'}, (err, posts) => {
    res.render('index', { posts, user: req.user });
  });
});

module.exports = router;
