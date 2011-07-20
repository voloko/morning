var u = require('../../muv/u');


var Base = module.exports = function() {};
var p = Base.prototype;

p.show = function(container, options) {};
p.update = function(options) {};

p.transitionOutStart = function() {
  this.scrollTop = document.body.scrollTop;
  // this.container.style.marginTop = -this.scrollTop + 'px';
  // document.body.scrollTop = 0;
};

p.transitionOutEnd = function() {
  // this.container.style.marginTop = 0;
};

p.transitionInStart = function() {
  var scrollTop = this.scrollTop || 1;
  this.container.style.top = (document.body.scrollTop - this.scrollTop) + 'px';
};

p.transitionInEnd = function() {
  var scrollTop = this.scrollTop || 1;
  var container = this.container;
  container.style.top = '';
  setTimeout(function() {
    document.body.scrollTop = scrollTop;
  }, 1)
};

p.parentStateName = 'home';
p.parentStateOptions = {};

p.title = '';