var u = require('../../muv/u');
var api = require('../lib/api');
var Base = require('./baseSync');

var Sync = u.extend({}, Base, {
  model: require('../model/post'),

  fqlTable: 'stream'
});

Sync.fetchHome = function(options, callback) {
  options = options || {};

  api.multiquery({
    posts: this.buildSELECT('all') +
      ' WHERE filter_key = "others"' +
      'LIMIT ' + options.limit || 25,
    pages: require('./pageSync').buildSELECT('min') +
      ' WHERE page_id IN (SELECT actor_id FROM #posts)' +
      ' OR page_id IN (SELECT source_id FROM #posts)' +
      ' OR page_id IN (SELECT tagged_ids FROM #posts)' +
      ' OR page_id IN (SELECT target_id FROM #posts)',
    users: require('./userSync').buildSELECT('min') +
      ' WHERE uid IN (SELECT actor_id FROM #posts)' +
      ' OR uid IN (SELECT source_id FROM #posts)' +
      ' OR uid IN (SELECT tagged_ids FROM #posts)' +
      ' OR uid IN (SELECT target_id FROM #posts)'
  }, function(r) {
    var posts = Sync.createAndCacheModels('all', r.posts);
    require('./pageSync').createAndCacheModels('min', r.pages);
    require('./userSync').createAndCacheModels('min', r.users);
    callback(posts);
  });
};


module.exports = Sync;
