var u = require('muv/u');
var api = require('app/lib/api');
var Base = require('./baseSync');

var Sync = u.extend({}, Base, {
  model: require('app/model/post'),

  fqlTable: 'stream'
});

Sync.getPostFromCache = function(id) {
  return Base.cached(id);
};

Sync.fetchPost = function(id, callback) {
  api.multiquery(
    buildMultiquery('WHERE post_id = "' + id + '"'),
    function(r) {
    var posts = Sync.createAndCacheModels('all', r.posts, true);
    require('./pageSync').createAndCacheModels('min', r.pages, true);
    require('./userSync').createAndCacheModels('min', r.users, true);
    callback(posts[0]);
  });
};

Sync.getHomeFromCache = function() {
  var ids = Base.cached('request:home');
  if (ids) {
    return ids.post_ids.map(function(id) {
      return Base.cached(id);
    }).filter(function(x) {
      return !!x;
    });
  }
  return [];
};

Sync.fetchHome = function(options, callback) {
  options = options || {};

  api.multiquery(buildMultiquery(
    'WHERE filter_key IN ("others")' +
    (options.after ? ' AND created_time < ' + options.after : '') +
    ' LIMIT ' + (options.limit || 25) +
    (options.offset ? ' OFFSET ' + options.offset : '')
  ), function(r) {
    var posts = Sync.createAndCacheModels('all', r.posts, !options.after && !options.offset);
    posts = posts.sort(function(a, b) {
      return b.order - a.order;
    });
    require('./pageSync').createAndCacheModels('min', r.pages, true);
    require('./userSync').createAndCacheModels('min', r.users, true);
    if (!options.after && !options.offset) Base.addToCache({ id: 'request:home', post_ids: posts.map(function(post) {
      return post.post_id;
    }) }, true);
    callback(posts);
  });
};

function buildMultiquery(where) {
  return {
    posts: Sync.buildSELECT('all') + ' ' + where,
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
  };
}


module.exports = Sync;
