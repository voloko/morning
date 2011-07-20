var u = require('../../muv/u');


var Base = module.exports = function() {};
var p = Base.prototype;

p.show = function(container, options) {};
p.update = function(options) {};

p.transitionOutStart = function() {
  this.scrollTop = document.body.scrollTop;
};

p.transitionOutEnd = function() {};

p.transitionInStart = function() {};

p.transitionInEnd = function() {
  var scrollTop = this.scrollTop || 1;
  setTimeout(function() {
    document.body.scrollTop = scrollTop;
  }, 1);
};

p.parentStateName = 'home';
p.parentStateOptions = {};

p.title = '';