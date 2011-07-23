/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
var v = require('muv/v');
var u = require('muv/u');

var Home = module.exports = u.createClass(require('./base'));
var p = Home.prototype;

p.show = function(container, options) {
  this.container = container;
  this.container.appendChild(v({ text: '111' }));
  this.title = options;
};

p.title = 'Profile';
p.isHome = true;
