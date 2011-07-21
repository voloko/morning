var v = require('muv/v');
var u = require('muv/u');

var Post = module.exports = u.createClass(require('./base'));
var p = Post.prototype;

p.show = function(container, options) {
  this.container = container;
  this.container.appendChild(
    v({ fragment: true, children: [
      { view: require('app/view/post/standalonePost'), as: 'post' },
      { view: require('app/view/commentList/commentList'), as: 'list' }
    ]}, this)
  );
  this.update(options);
};

p.update = function(options) {
  var postSync = require('app/sync/postSync');
  var commentSync = require('app/sync/commentSync');
  
  var post = postSync.getPostFromCache(options.id);
  if (post) {
    this.post.value = post;
  }

  var comments = commentSync.getForPostFromCache(options.id);
  if (comments) {
    this.list.items = comments.slice(0, 25);
  } else {
    this.list.items = [];
  }
  
  postSync.fetchPost(options.id, u.bind(function(posts) {
    this.post.value = posts[0];
  }, this));
  
  commentSync.fetchForPost(options.id, { limit: 25 }, u.bind(function(comments) {
    this.list.assimilate(comments);
  }, this));
};

p.title = 'Post';
