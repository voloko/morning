var u = require('muv/u');


var Base = module.exports = function() {};
var p = Base.prototype;

p.show = function(container, options) {};
p.update = function(options) {};

p.defaultParentState = { name: 'home', options: {} };
p.parentState = null;

p.title = '';