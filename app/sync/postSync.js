var u = require('../../muv/u');
var api = require('../lib/api');
var Base = require('./baseSync');

var Sync = u.extend({}, Base, {
  model: require('../model/post'),
  
  getFqlFields: function() {
    return this.model.prototype.propNames.slice(1);
  },
  
  fqlTable: 'stream'
});

Sync.fetchHome = function(options, callback) {
  api.multiquery({
    posts: this.buildSELECT(options) + 
      ' WHERE filter_key = "others"' +
      'LIMIT ' + options.limit || 25,
    members: require('./profileSync').buildSELECT() + 
      ' WHERE id IN (SELECT actor_id FROM #posts)' +
      ' OR id IN (SELECT source_id FROM #posts)' +
      ' OR id IN (SELECT target_id FROM #posts)'
  }, function(r) {
    var posts = Sync.result2Models(r.posts);
    require('./profileSync').result2Models(r.members);
    callback(posts);
  });
};


module.exports = Sync;
