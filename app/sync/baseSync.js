var Sync = {
  model: null,
  
  fqlTable: '',
  
  getFqlFields: function() {
    return this.model.prototype.propNames;
  },
  
  buildSELECT: function(options) {
    options = options || {};
    var fields = options.fields || this.getFqlFields();
    return 'SELECT ' + fields.join(', ') + ' FROM ' + this.fqlTable;
  },
  
  result2Models: function(result) {
    var Model = this.model;
    return result.map(function(data) {
      var model = new Model(data);
      Sync.addToCache(model);
      return model;
    });
  },
  
  addToCache: function(item) {
    this.cache[item.id] = item;
  },
  
  cached: function(id) {
    return this.cache[id];
  },
  
  cache: {}
};

module.exports = Sync;