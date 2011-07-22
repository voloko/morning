var tx = require('app/lib/tx');

var More = module.exports = require('app/view/datalist/more').createClass();
var p = More.prototype;

p.defaultClassName = CLS('m-datalist-more m-comment-list-more m-bg-comment');

p._moreText = function() {
  return tx('cmt:more');
};

p._loadingText = function() {
  return tx('common:loading');
};