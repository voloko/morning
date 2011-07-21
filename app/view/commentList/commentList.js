requireCss('./commentList.css');

var v = require('muv/v');
var u = require('muv/u');
var Comment = require('app/view/comment/comment');

var List = module.exports = require('app/view/datalist/datalist').createClass();
var p = List.prototype;

p.defaultClassName = CLS('m-comment-list');

p._itemsToViews = function(items) {
  return items.map(function(item) {
    return { view: Comment, value: item };
  });
};

p.updateView = function(view, item) {};
