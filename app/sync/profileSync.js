var u = require('../../muv/u');
var api = require('../lib/api');
var Base = require('./baseSync');

var Sync = u.extend({}, Base, {
  model: require('../model/profile'),
  
  fqlTable: 'profile'
});


module.exports = Sync;
