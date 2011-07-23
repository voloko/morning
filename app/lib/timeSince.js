/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
var tx = require('./tx');

var MINUTE = 60;
var HOUR = 3600;
var SHORT_MONTH_NNAMES = [
  tx('dta:jan'), tx('dta:feb'), tx('dta:mar'), tx('dta:apr'),
  tx('dta:may'), tx('dta:jun'), tx('dta:jul'), tx('dta:aug'),
  tx('dta:sep'), tx('dta:oct'), tx('dta:nov'), tx('dta:dec')
];

module.exports = function(dt) {
  var now = new Date();
  var elapsed = (now - dt.getTime())/1000;
  
  if (elapsed < MINUTE) {
    return tx('dtr:now');
  }
  
  if (elapsed < HOUR) {
    var minutes = elapsed / MINUTE << 0;
    if (minutes === 1) {
      return tx('dtr:1min');
    }
    return tx('dtr:nmin', { number: minutes });
  }

  var hours = elapsed / HOUR  << 0;
  if (hours == 1) {
    return tx('dtr:n1hr');
  }
  if (hours < 12) {
    return tx('dtr:nhr', { number: hours });
  }
  
  if (hours < 24) {
    var time = dt.getHours() + ':' + dt.getMinutes();
    if (dt.getDate() == now.getDate()) {
      return tx('dtr:today', {time: time});
    } else {
      return tx('dtr:yesterday', {time: time});
    }
  }
  
  return dt.getDate() + ' ' + SHORT_MONTH_NNAMES[dt.getMonth()];
};