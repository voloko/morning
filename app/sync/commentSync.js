var u = require('muv/u');
var api = require('app/lib/api');
var Base = require('./baseSync');

var Sync = u.extend({}, Base, {
  model: require('app/model/comment'),

  fqlTable: 'comment'
});

Sync.getForPostFromCache = function(postId) {
  var ids = Base.cached('request:comments:' + postId);
  if (ids) {
    return ids.ids.map(function(id) {
      return Base.cached(id);
    }).filter(function(x) {
      return !!x;
    });
  }
  return [];
};


Sync.fetchForPost = function(postId, options, callback) {
  options = options || {};

  api.multiquery(buildMultiquery(
    'WHERE post_id = "' + postId + '"' +
    (options.after ? ' AND time < ' + options.after : '') +
    ' ORDER BY time DESC LIMIT ' + (options.limit || 25) +
    (options.offset ? ' OFFSET ' + options.offset : '')
  ), function(r) {
    var comments = Sync.createAndCacheModels(
      'all',
      r.comments,
      !options.after && !options.offset);

    comments = comments.sort(function(a, b) {
      return a.order - b.order;
    });
    require('./pageSync').createAndCacheModels('min', r.pages, true);
    require('./userSync').createAndCacheModels('min', r.users, true);
    if (!options.after && !options.offset) {
      Base.addToCache({
        id: 'request:comments:' + postId,
        ids: comments.map(function(c) { return c.id; })
      }, true);
    }
    callback(comments);
  });
};

function buildMultiquery(where) {
  return {
    comments: Sync.buildSELECT('all') + ' ' + where,
    pages: require('./pageSync').buildSELECT('min') +
      ' WHERE page_id IN (SELECT fromid FROM #comments)',
    users: require('./userSync').buildSELECT('min') +
      ' WHERE uid IN (SELECT fromid FROM #comments)'
  };
}


module.exports = Sync;
