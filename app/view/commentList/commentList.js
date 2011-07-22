requireCss('./commentList.css');

var v = require('muv/v');
var u = require('muv/u');
var Comment = require('app/view/comment/comment');

var Base = require('app/view/datalist/datalist');
var List = module.exports = Base.createClass();
var p = List.prototype;

p.defaultClassName = CLS('m-comment-list');

p._createDom = function() {
  this.dom = v({ tag: 'div', className: this.defaultClassName, children: [
    { view: require('./more'), as: 'more' },
    this._loadingView(),
    { tag: 'div', as: 'container' },
    { tag: 'div', className: CLS('m-comment-list-action'), children: [
      { view: require('app/view/composer/composer'), as: 'composer' }
    ]}
  ]}, this);
  
  this._initDom();
};

p._itemsToViews = function(items) {
  return items.map(function(item) {
    return { view: Comment, value: item };
  });
};

p._updateExistingView = function(view, item) {};

p._compareItems = function(a, b) {
  return b.order > a.order;
};

p.assimilate = function(items) {
  Base.prototype.assimilate.call(this, items);
  var extra = [];
  var map = {};
  this.items.forEach(function(item) {
    var fromid = item.fromid;
    if (!map[fromid]) {
      map[fromid] = true;
      var user = require('app/sync/userSync').cached(fromid);
      if (user) { extra.unshift(user); }
    }
  });
  this.composer.extraSuggestions = extra;
};
