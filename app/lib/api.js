exports.query = function(query, callback) {
  FB.api({ method: 'fql.query', query: query }, function(result) {
    callback(result);
  });
};

exports.multiquery = function(queries, callback) {
  console.log('multiquery:sql', queries);
  FB.api({ method: 'fql.multiquery', queries: queries }, function(result) {
    console.log('multiquery:result', queries);
    var hashResult = {};
    result.forEach(function(item) {
      hashResult[item.name] = item.fql_result_set;
    });
    callback(hashResult);
  });
};


Object.defineProperty(exports, 'uid', {
  get: function() {
    return FB.getSession().uid;
  }
});
