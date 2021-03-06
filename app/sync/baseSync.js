/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
var storage = global.localStorage;
function tableToSyncer(table) {
  switch(table) {
    case 'stream': return require('./postSync');
    case 'user': return require('./userSync');
    case 'page': return require('./pageSync');
    case 'comment': return require('./commentSync');
  }
  return null;
}

var TTL = 1000*60*60*24*7; // cache for a week
var MAX_SIZE = 500;

function gc() {
  var re = /^c:(.*)/;
  var now = + new Date;
  for (var key in storage) {
    var match = key.match(re);
    if (match) {
      var row = JSON.parse(storage[key]);
      if (now - row[0] > TTL) {
        delete storage[key];
      }
    }
  }
}

if (storage.length > MAX_SIZE) {
  gc();
}


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

  createAndCacheModels: function(fieldSet, data, permanent) {
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
        this.addToCache(cachedModel, permanent);
        return cachedModel;
      } else {
        this.addToCache(newModel, permanent);
        return newModel;
      }
    }, this);
  },

  addToCache: function(model, permanent) {
    var t = +new Date;
    this.cache[model.id] = [t, model];
    if (permanent) {
      storage['c:' + model.id] =
        JSON.stringify([t, this.fqlTable, model.propValues || model]);
    }
  },

  cached: function(id) {
    if (!this.cache[id]) {
      var key = 'c:' + id;
      if (storage[key]) {
        try {
          var row = JSON.parse(storage[key]);
          var syncer = tableToSyncer(row[1]);
          var model = syncer ? new syncer.model(row[2]) : row[2];
          this.cache[model.id] = [row[0], model];
        } catch(e) {}
      }
    };
    return this.cache[id] && this.cache[id][1];
  },

  cacheTime: function(id) {
    var c = this.cached(id);
    return c ? new Date(this.cache[id][0]) : 0;
  },

  cache: {}
};

module.exports = Sync;
