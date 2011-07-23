/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
var v = require('muv/v');
var u = require('muv/u');

var Home = module.exports = u.createClass(require('./base'));
var p = Home.prototype;

p.show = function(container, options) {
  this.container = container;
  this.container.appendChild(v(
    { view: require('app/view/profile/header'), as: 'header' },
    this
  ).dom);
  this.update(options);
};

p.update = function(options) {
  this.options = options;
  
  var userSync = require('app/sync/userSync');
  var user = userSync.getUserFromCache(options.id);
  if (user) {
    this.header.value = user;
  }
  userSync.fetchUser(this.options.id, u.bind(function(user) {
    this.header.value = user
  }, this));
};

p.title = 'Profile';
p.isHome = false;
