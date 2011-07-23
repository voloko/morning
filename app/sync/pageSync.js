/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
var u = require('muv/u');
var api = require('app/lib/api');
var Base = require('./baseSync');

var Sync = u.extend({}, Base, {
  model: require('app/model/page'),

  fqlTable: 'page',

  getFqlFieldsMinimal: function() {
    return ['page_id', 'name', 'pic_square', 'username', 'page_url'];
  }

});

module.exports = Sync;
