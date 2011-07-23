/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
var v = require('muv/v');

exports.goToProfile = function() {
  var value = v.nearest(this).value;
  var user = value.actor || value.from;
  if (!user || user.type != 'user') return;

  require('app/app').goTo({
    name: 'profile',
    options: { id: user.id }
  }, true);
}

exports.goToPost = function() {
  require('app/app').goTo({
    name: 'post',
    options: { id: v.nearest(this).value.id }
  }, true);
}
