var log = [];
var ready = false;

exports.query = function(query, callback) {
  if (!ready) {
    log.push(['query', query, callback]);
    return;
  }
  FB.api({ method: 'fql.query', query: query }, function(result) {
    callback(result);
  });
};

exports.multiquery = function(queries, callback) {
  if (!ready) {
    log.push(['multiquery', queries, callback]);
    return;
  }
  console.log('multiquery:sql', queries);
  FB.api({ method: 'fql.multiquery', queries: queries }, function(result) {
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
    console.log('from log');
    exports[row[0]].call(exports, row[1], row[2]);
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
