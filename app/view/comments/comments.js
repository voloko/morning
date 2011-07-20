requireCss('./comments.css');

var v = require('muv/v');
var u = require('muv/u');

var Comments = module.exports = v.Base.createClass();
var p = Comments.prototype;

p.defaultClassName = 'm-comments';
