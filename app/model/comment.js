var m = require('muv/m');
var u = require('muv/u');

var Comment = module.exports = require('./base').createClass();
var p = Comment.prototype;

var obj = {};
m.defineProperties(p, {
  xid:        obj,
  object_id:  obj,
  post_id:    obj,
  fromid:     obj,
  time:       obj,
  text:       obj,
  id:         obj,
  // username:   obj,
  // reply_xid:  obj,
  // post_fbid:  obj,
  likes:      obj,
  user_likes: obj
});
