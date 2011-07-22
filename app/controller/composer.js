var v = require('muv/v');
var u = require('muv/u');

var Home = module.exports = u.createClass(require('./base'));
var p = Home.prototype;

p.show = function(container, options) {
  this.container = container;
  this.container.appendChild(
    v({ view: require('app/view/composer/composer'), as: 'text' }, this).dom
  );
  this.update(options);
};

p.update = function(options) {
};

p.useInput = function(input) {
  this.text.input = input;
};

p.title = 'Post';
p.isHome = false;
