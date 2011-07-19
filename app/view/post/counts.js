requireCss('./counts.css');

var v = require('../../../muv/v');
var tx = require('../../lib/tx');

var PostCounts = v.PostCounts = require('../composable').createClass();
var p = v.PostCounts.prototype;

p.defaultClassName = 'm-post-counts';

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
  var likes = this.value.likes && this.value.likes.count;
  var comments = this.value.comments && this.value.comments.count;
  return v(
    { fragment: true, children: [
      { tag: 'div', className: 'm-post-counts-nub' },
      { tag: 'div', className: 'm-post-counts-bar', children: [
        likes && { tag: 'span', className: 'm-post-counts-likes', text: formatLikes(likes) },
        comments && { tag: 'span', className: 'm-post-counts-comments', text: formatComments(comments) }
      ] }
    ] }
  );
};


module.exports = PostCounts;