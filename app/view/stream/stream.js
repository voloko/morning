requireCss('./stream.css');

var v = require('../../../muv/v');
var u = require('../../../muv/u');
var Post = require('../post/post');

var Stream = v.Base.createClass();
var p = Stream.prototype;

p.defaultClassName = 'm-steam';

p._createDom = function() {
  this.refs = {};
  this.dom = v({ tag: 'div', className: this.defaultClassName, children: [
    { view: require('./loading'), as: 'loading' },
    { view: require('./more'), as: 'more' }
  ]}, this.refs);
  u.cls.add(this.refs.more, 'hidden');
  u.cls.add(this.refs.loading, 'hidden');
  this.refs.more.addEventListener('click', u.bind(function() {
    if (!this.loading) {
      this.trigger({ type: 'loadMore', posts: this.posts });
    }
  }, this));
};

p._setup = function() {
  this.posts = [];
};

Object.defineProperties(p, {
  loading: {
    set: function(value) {
      this.refs.more.loading = value;
      u.cls.toggle(this.refs.loading, 'hidden', !value);
    },
    get: function() {
      return !u.cls.has(this.refs.loading, 'hidden');
    }
  },
  hasMore: {
    set: function(value) {
      u.cls.toggle(this.refs.more, 'hidden', !value);
    },
    get: function() {
      return !u.cls.has(this.refs.more, 'hidden');
    }
  }
});

function postsToViews(posts) {
  return posts.map(function(post) {
    return { view: Post, value: post };
  });
}

p.assimilatePosts = function(posts) {
  if (this.posts.length) {
    var newPosts = [];
    var groups = [[]];
    var j = 0;
    var children = [].slice.call(this.children, 1);
    for (var i = 0; i < posts.length; i++) {
      while (this.posts[j] && this.posts[j].created_time > posts[i].created_time) {
        groups[++j] = [];
      }
      if (!this.posts[j] && !groups[j]) {
        groups[j] = [];
      }
      if (this.posts[j] && posts[i].id == this.posts[j].id) {
        v.nearest(children[j]).updateCounts();
      } else {
        groups[j].push(posts[i]);
      }
    }
    for (i = 0; i < groups.length; i++) {
      var group = groups[i];
      if (group.length) {
        this.insertBefore(v({ fragment: true, children: postsToViews(group) }), children[i]);
      }
    }
    this.posts = [];
    for (i = 0; i < this.children.length; i++) {
      var view = v.nearest(this.children[i]);
      view.value && this.posts.push(view.value);
    };
  } else {
    this.posts = this.posts.concat(posts);
    this.insertBefore(v({ fragment: true, children: postsToViews(posts) }), this.refs.more);
  }
};

module.exports = Stream;
