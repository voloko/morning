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
};

p._setup = function() {
  this.posts = [];
};

p.appendPosts = function(posts) {
  this.posts = this.posts.concat(posts);
  this.insertBefore(v({
    fragment: true,
    children: posts.map(function(post) {
      return { view: Post, value: post };
    })
  }), this.refs.more);
  u.cls.add(this.refs.loading, 'hidden');
  u.cls.remove(this.refs.more, 'hidden');
};

module.exports = Stream;
