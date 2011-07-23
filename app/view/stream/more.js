/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
var tx = require('app/lib/tx');

var More = module.exports = require('app/view/datalist/more').createClass();
var p = More.prototype;

p._moreText = function() {
  return tx('str:more');
};

p._loadingText = function() {
  return tx('common:loading');
};
