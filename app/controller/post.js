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

  postSync.fetchPost(options.id, u.bind(function(posts) {
    this.post.value = post;
  }, this));
  
  var comments = commentSync.getForPostFromCache(options.id);
  if (comments) {
    this.list.items = comments.slice(10);
  } else {
    this.list.items = [];
  }
  
  commentSync.fetchForPost(options.id, { limit: 10 }, u.bind(function(comments) {
    this.list.assimilate(comments);
  }, this));
};

p.title = 'Post';
