const express    = require('express');
const Comment    = require('../models/comment');
const Post       = require('../models/post');
const multer     = require('multer');
const upload     = multer({ dest: 'public/uploads/comment-pictures' });
const router     = express.Router();
const { ensureLoggedIn } = require('connect-ensure-login');

router.get('/posts/:postId/comments/new', ensureLoggedIn('/login'), (req, res, next) => {
  res.render('comments/new', { postId: req.params.postId });
});

router.post('/posts/:postId/comments',
  [ ensureLoggedIn('/login'), upload.single('comment-picture')],
  (req, res, next) => {

  const { file } = req;
  const { content } = req.body;

  const newComment = new Comment({
    content,
    _postId: req.params.postId,
  });

  if (file){
    newComment.picPath =  `/uploads/comment-pictures/${file.filename}`;
    newComment.picName = file.originalname
  }

  Post.findById(req.params.postId, (err, post) => {
    post.comments.push(newComment);
    post.save( (err) => {
      if (err) { return next(err); }
      return res.redirect(`/posts/${req.params.postId}`);
    });
  });
});

module.exports = router;
