/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
var u = require('muv/u');

var Base = module.exports = function() {};
var p = Base.prototype;

p.show = function(container, options) {};
p.update = function(options) {};

p.defaultParentState = { name: 'home', options: {} };
p.parentState = null;

p.destruct = function() {
  require('muv/v').destructAll(this.container);
};

p.title = '';