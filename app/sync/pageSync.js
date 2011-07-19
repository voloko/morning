var u = require('../../muv/u');
var api = require('../lib/api');
var Base = require('./baseSync');

var Sync = u.extend({}, Base, {
  model: require('../model/page'),
  
  fqlTable: 'page',
  
  getFqlFieldsMinimal: function() {
    return ['page_id', 'name', 'pic_square', 'username', 'page_url'];
  }
  
});


module.exports = Sync;
