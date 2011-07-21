var v = require('muv/v');
var u = require('muv/u');

var Post = module.exports = u.createClass(require('./base'));
var p = Post.prototype;

p.show = function(container, options) {
  this.refs = {};
  this.container = container;
  this.container.appendChild(
    v({ view: require('app/view/post/standalonePost'), as: 'post' }, this.refs).dom
  );
  this.update(options);
};

p.update = function(options) {
  var postView = this.refs.post;

  var postSync = require('app/sync/postSync');
  var commentSync = require('app/sync/commentSync');
  
  var post = postSync.getPostFromCache(options.id);
  if (post) {
    postView.value = post;
  }

  postSync.fetchPost(options.id, function(posts) {
    postView.value = post;
  });
  
  commentSync.fetchForPost(options.id, {}, function(comments) {
    console.log(comments);
  });
};

p.title = 'Post';
