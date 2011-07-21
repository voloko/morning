requireCss('./stream.css');

var v = require('muv/v');
var u = require('muv/u');
var Post = require('app/view/post/post');

var Stream = module.exports = require('app/view/datalist/datalist').createClass();
var p = Stream.prototype;

p.defaultClassName = 'm-steam';

p.itemsToViews = function(items) {
  return items.map(function(post) {
    return { view: Post, value: post };
  });
};

p._moreView = function() {
  return { view: require('./more'), as: 'more' };
};


p.updateView = function(view, item) {
  v.nearest(view).updateCounts();
};

p.updateMissedView = function(view, item) {
  view.parentNode.removeChild(view);
};
