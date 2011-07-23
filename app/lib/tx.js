/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
var strings = require('./i18n/strings');

module.exports = function(txKey, args) {
  var str = strings[txKey];
  if (!str) { return ''; }
  if (args) {
    for (var key in args) {
      var regexp = new RegExp('\\{' + key + '\\}', 'g');
      str = str.replace(regexp, args[key]);
    }
  }
  return str;
};