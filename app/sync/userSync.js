/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
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

var queue = [];
var TTL = 1000*60*60*24; // cache once a week
var friends;
Sync.getFriendsFromSomewhere = function(callback) {
  if (queue.length > 0) {
    queue.push(callback);
  } else {
    var d = Base.cacheTime('request:friends');
    if (d && new Date - d.getTime() < TTL) {
      callback(Sync.getFriendsFromCache());
    } else {
      queue = [callback];
      Sync.fetchFriends(function(users) {
        queue.forEach(function(callback) {
          callback(users);
        });
      });
    }
  }
};

Sync.getFriendsFromCache = function() {
  if (friends) { return friends; }
  var ids = Base.cached('request:friends');
  if (ids) {
    friends = ids.ids.map(function(id) {
      return Base.cached(id);
    }).filter(function(x) {
      return !!x;
    });
    return friends;
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
