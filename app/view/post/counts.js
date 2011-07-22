requireCss('./counts.css');
requireCss('../bg/bg.css');

var v = require('muv/v');
var tx = require('app/lib/tx');

var PostCounts = module.exports = require('app/view/composable').createClass();
var p = PostCounts.prototype;

p.defaultClassName = CLS('m-post-counts');

p._createDom = function(markup) {
  this.dom = v({ tag: 'a' });
  this.defaultClassName && (this.className = this.defaultClassName);
};

function formatLikes(count) {
  return count > 1 ? tx('pct:nlk', { count: count }) : tx('pct:1lk');
}

function formatComments(count) {
  return count > 1 ? tx('pct:ncm', { count: count }) : tx('pct:1cm');
}

p.compose = function() {
  var likes = this.value.likes && this.value.likes.count*1;
  var comments = this.value.comments && this.value.comments.count*1;
  this.dom.href = '#';
  var id = this.value.id;
  this.dom['data-click-action'] = function() {
    require('app/app').goTo({ name: 'post', options: { id: id } }, true);
  };
  return v(
    { fragment: true, children: [
      { tag: 'div', className: CLS('m-post-counts-nub') },
      { tag: 'div', className: CLS('m-post-counts-bar'), children: [
        likes && { tag: 'span', className: CLS('m-post-counts-likes m-bg-like'),
          text: formatLikes(likes), as: 'likes' },
        comments && { tag: 'span',
          className: CLS('m-post-counts-comments m-bg-comment'),
          text: formatComments(comments), as: 'comments' }
      ] }
    ] }
  );
};
