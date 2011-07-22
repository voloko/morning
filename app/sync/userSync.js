var u = require('muv/u');
var api = require('app/lib/api');
var Base = require('./baseSync');

var Sync = u.extend({}, Base, {
  model: require('app/model/user'),
  
  fqlTable: 'user',
  
  getFqlFieldsMinimal: function() {
    return ['uid', 'name', 'pic_square', 'username', 'profile_url'];
  }
  
});

Sync.getFriendsFromCache = function() {
  var ids = Base.cached('request:friends');
  if (ids) {
    return ids.ids.map(function(id) {
      return Base.cached(id);
    }).filter(function(x) {
      return !!x;
    });
  }
  return [];
};

Sync.fetchFriends = function(callback) {
  api.multiquery({
    users: Sync.buildSELECT('min') + 
      ' WHERE uid in (SELECT uid2 FROM #ids)',
    ids: 'SELECT uid2 FROM friend WHERE uid1 = me()'
  }, function(r) {
    var users = Sync.createAndCacheModels('min', r.users, true);
    Base.addToCache({ id: 'request:friends', ids: r.users.map(function(u) {
      return u.uid;
    }) }, true);
    
    callback(users);
  });
};


module.exports = Sync;
