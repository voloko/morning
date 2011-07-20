requireCss('./post.css');

var v = require('../../../muv/v');
var u = require('../../../muv/u');

var Post = module.exports = require('./post').createClass();
var p = Post.prototype;

p.defaultClassName = 'm-post m-post_standalone';


p.composeCounts = function() {};

p.composeActions = function() {};
