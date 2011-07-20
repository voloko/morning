var m = require('muv/m');
var u = require('muv/u');

var Post = module.exports = require('./base').createClass();
var p = Post.prototype;

var obj = {};
m.defineProperties(p, {
  post_id:      obj,
  app_id:       obj,
  source_id:    obj,
  updated_time: obj,   
  created_time: obj,   
  filter_key:   obj, 
  attribution:  obj,  
  actor_id:     obj,
  target_id:    obj,
  message:      obj,
  app_data:     obj,
  action_links: obj,   
  attachment:   obj, 
  comments:     obj,
  likes:        obj,
  privacy:      obj,
  permalink:    obj,
  tagged_ids:   obj
});

Object.defineProperties(p, {
  time: { 
    configurable: true,
    get: function() {
      return new Date(this.created_time*1000);
    } },
    
  actor: { 
    configurable: true,
    get: function() {
      return require('app/sync/baseSync').cached(this.actor_id);
    } },
  target: { 
    configurable: true,
    get: function() {
      return require('app/sync/baseSync').cached(this.target_id);
    } },
  source: { 
    configurable: true,
    get: function() {
      return require('app/sync/baseSync').cached(this.source_id);
    } },
  hasCommentsOrLikes: {
    get: function() {
      return (this.comments && this.comments.count*1) || (this.likes && this.likes.count*1);
    }
  }
});

u.alias.prop(p, 'post_id', 'id');
// remove id as real prop
p.propNames = p.propNames.slice(1);
