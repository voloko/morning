var v = require('../../muv/v');
var u = require('../../muv/u');

var Post = module.exports = u.createClass(require('./base'));
var p = Post.prototype;

p.show = function(container, options) {
  this.refs = {};
  this.container = container;
  this.container.appendChild(
    v({ view: require('../view/post/post'), as: 'post' }, this.refs).dom
  );
  var postView = this.refs.post;

  var postSync = require('../sync/postSync');
  var post = postSync.getPostFromCache(options.id);
  if (post) {
    postView.value = post;
  }

  postSync.fetchPost(options.id, function(posts) {
    postView.value = post;
  });
};

p.title = 'Post';
