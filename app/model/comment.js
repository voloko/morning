/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
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

p.toggleLike = function(callback) {
  require('app/lib/api').api(
    '/' + this.id + '/likes', 
    this.user_likes ? 'delete' : 'post', 
    {}, 
    u.bind(function(r) {
      if (r === true) {
        this.user_likes = !this.user_likes;
        this.likes = this.likes * 1 + (this.user_likes ? 1 : -1);
        require('app/sync/commentSync').addToCache(this, true);
      }
      callback();
    }, this));
};

Object.defineProperties(p, {
  order: {
    configurable: true,
    get: function() {
      return this.time*1;
    } },
  
  from: {
    configurable: true,
    get: function() {
      return require('app/sync/baseSync').cached(this.fromid);
    }
  },
  
  datetime: { 
    configurable: true,
    get: function() {
      return new Date(this.time*1000);
    } }

} );
