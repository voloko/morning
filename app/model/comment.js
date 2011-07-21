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


Object.defineProperties(p, {
  order: {
    configurable: true,
    get: function() {
      return this.created_time*1;
    } },
  
  from: {
    configurable: true,
    get: function() {
      return require('app/sync/baseSync').cached(this.fromid);
    }
  }

} );
