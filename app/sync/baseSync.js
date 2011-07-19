var Sync = {
  model: null,

  fqlTable: '',

  cacheProfiles: ['min', 'all'],

  getFqlFields: function(fieldSet) {
    return fieldSet === 'min' ?
      this.getFqlFieldsMinimal() :
      this.getFqlFieldsAll();
  },

  getFqlFieldsMinimal: function() {
    return this.model.prototype.propNames;
  },

  getFqlFieldsAll: function() {
    return this.model.prototype.propNames;
  },

  buildSELECT: function(fieldSet) {
    var fields = this.getFqlFields(fieldSet);
    return 'SELECT ' + fields.join(', ') + ' FROM ' + this.fqlTable;
  },

  createAndCacheModels: function(fieldSet, data) {
    var Model = this.model;
    var fields = this.getFqlFields(fieldSet);

    return data.map(function(dataRow) {
      var newModel = new Model(dataRow);
      newModel.fieldSet = fieldSet;

      var cachedModel = this.cached(newModel.id);
      if (cachedModel) {
        fields.forEach(function(name) {
          cachedModel[name] = newModel[name];
        });
        if (fieldSet == 'all' && cachedModel.fieldSet == 'min') {
          cachedModel.fieldSet = fieldSet;
        }
        return cachedModel;
      } else {
        this.cache[newModel.id] = newModel;
        return newModel;
      }
    }, this);
  },

  cached: function(id) {
    return this.cache[id];
  },

  cache: {}
};

module.exports = Sync;