/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
var log = [];
var ready = false;

function api() {
  if (!ready) {
    log.push(arguments);
    return;
  }
  FB.api.apply(FB, arguments);
};

exports.api = api;

exports.method = function(options, callback) {
  api(options, function(result) { callback(result); });
};

exports.query = function(query, callback) {
  api({ method: 'fql.query', query: query }, function(result) {
    callback(result);
  });
};

exports.multiquery = function(queries, callback) {
  console.log('multiquery:sql', queries);
  api({ method: 'fql.multiquery', queries: queries }, function(result) {
    if (result.error_msg) {
      alert(result.error_msg);
      return;
    }
    var hashResult = {};
    result.forEach(function(item) {
      hashResult[item.name] = item.fql_result_set;
    });
    console.log('multiquery:result', hashResult);
    callback(hashResult);
  });
};


exports.init = function() {
  ready = true;
  log.forEach(function(row) {
    FB.api.apply(FB, row);
  });
  log = [];
};


Object.defineProperty(exports, 'uid', {
  get: function() {
    if (!ready) {
      return null;
    }
    return FB.getSession().uid;
  }
});
