requireCss('./commentList.css');

var v = require('muv/v');
var u = require('muv/u');
var Comment = require('app/view/comment/comment');

var List = module.exports = require('app/view/datalist/datalist').createClass();
var p = List.prototype;

p.defaultClassName = CLS('m-comment-list');

p._createDom = function() {
  this.dom = v({ tag: 'div', className: this.defaultClassName, children: [
    { view: require('./more'), as: 'more' },
    { tag: 'div', as: 'container' },
    this._loadingView(),
    { view: require('./action'), as: 'action' }
  ]}, this);
  
  this._initDom();
};

p._itemsToViews = function(items) {
  return items.map(function(item) {
    return { view: Comment, value: item };
  });
};

p._updateExistingView = function(view, item) {
  v.nearest(view).updateLikes();
};

p._compareItems = function(a, b) {
    return b.order > a.order;
};
