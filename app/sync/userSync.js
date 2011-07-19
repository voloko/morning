var u = require('../../muv/u');
var api = require('../lib/api');
var Base = require('./baseSync');

var Sync = u.extend({}, Base, {
  model: require('../model/user'),
  
  fqlTable: 'user',
  
  getFqlFieldsMinimal: function() {
    return ['uid', 'name', 'pic_square', 'username', 'profile_url'];
  }
  
});


module.exports = Sync;
