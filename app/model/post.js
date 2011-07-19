var m = require('../../muv/m');

var Post = m.Base.createClass();
var p = Post.prototype;

m.defineProperties(p, {
  post_id:      {},
  app_id:       {},
  source_id:    {},
  updated_time: {},   
  created_time: {},   
  filter_key:   {}, 
  attribution:  {},  
  actor_id:     {},
  target_id:    {},
  message:      {},
  app_data:     {},
  action_links: {},   
  attachment:   {}, 
  comments:     {},
  likes:        {},
  privacy:      {},
  permalink:    {},
  tagged_ids:   {}
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
      return require('../sync/baseSync').cached(this.actor_id);
    } },
  target: { 
    configurable: true,
    get: function() {
      return require('../sync/baseSync').cached(this.target_id);
    } },
  source: { 
    configurable: true,
    get: function() {
      return require('../sync/baseSync').cached(this.source_id);
    } }
});

Object.defineProperty(p, 'id', {
  configurable: true,
  enumerable: true,
  get: function() {
    return this.post_id;
  },
  set: function(value) {
    this.post_id = value;
  }
});


module.exports = Post;