var tx = require('app/lib/tx');

var More = module.exports = require('app/view/datalist/more').createClass();
var p = More.prototype;

p._moreText = function() {
  return tx('str:more');
};

p._loadingText = function() {
  return tx('str:loading');
};