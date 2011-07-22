var v = require('muv/v');
var u = require('muv/u');

var Post = module.exports = u.createClass(require('./base'));
var p = Post.prototype;

p.show = function(container, options) {
  this.container = container;
  u.cls.add(this.container, CLS('m-container_blue'));
  this.container.appendChild(
    v({ fragment: true, children: [
      { view: require('app/view/post/standalonePost'), as: 'post' },
      { view: require('app/view/commentList/header'), as: 'header' },
      { view: require('app/view/commentList/commentList'), as: 'list' }
    ]}, this)
  );
  this.update(options);

  this.list.addEventListener('loadMore', u.bind(function(e) {
    var items = e.data.items;
    var commentSync = require('app/sync/commentSync');

    commentSync.fetchForPost(
      this.post.value.id,
      { limit: 25, offset: items.length },
      u.bind(function(items) {
        this.list.assimilate(items);
        this.list.hasMore = true;
        this.list.isLoading = false;
        this._updateActions();
    }, this));
  }, this));
};

p.update = function(options) {
  var postSync = require('app/sync/postSync');
  var commentSync = require('app/sync/commentSync');

  this.list.items = [];
  this.list.action.stopComposing();

  var post = postSync.getPostFromCache(options.id);
  if (post) {
    this._setPost(post);
    var comments = commentSync.getForPostFromCache(options.id);
    if (comments) {
      this.list.items = comments.slice(0, 5);
      this._updateActions();
    }
  }


  postSync.fetchPost(options.id, u.bind(function(post) {
    this._setPost(post);

    commentSync.fetchForPost(options.id, { limit: 5 },
      u.bind(function(comments) {
      this.list.assimilate(comments);
      this._updateActions();
    }, this));
  }, this));

};

p._setPost = function(post) {
  this.post.value = post;
  this.header.likes = post.likes.count;
  // u.cls.toggle(this.header, CLS('hidden'), !post.hasCommentsOrLikes);
};

p._updateActions = function(post) {
  this.list.hasMore = this.post.value.comments.count > this.list.items.length;
};

p.title = 'Comments';
