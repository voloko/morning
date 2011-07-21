requireCss('./comments.css');

var v = require('muv/v');
var u = require('muv/u');

var Comments = module.exports = v.Base.createClass();
var p = Comments.prototype;


p._createDom = function() {
  this.refs = {};
  this.dom = v({ tag: 'div', className: this.defaultClassName, children: [
    { view: require('./loading'), as: 'loading' },
    { view: require('./more'), as: 'more' }
  ]}, this.refs);
  u.cls.add(this.refs.more, 'hidden');
  u.cls.add(this.loading, 'hidden');
  this.refs.more.addEventListener('click', u.bind(function() {
    if (!this.isLoading) {
      this.trigger({ type: 'loadMore', posts: this.posts });
    }
  }, this));
};

p._setup = function() {
  this._comments = [];
};

p.defaultClassName = 'm-comments';
