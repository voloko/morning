/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
requireCss('./like.css');
requireCss('../bg/bg.css');

var v = require('muv/v');
var u = require('muv/u');
var tx = require('app/lib/tx');

var Like = module.exports = v.Base.createClass();
var p = Like.prototype;

// cache definition, to conserve memory
var def = { tag: 'a', href: '#', className: CLS('m-like'),
  text: tx('common:like'),
  'data-click-action': function(e) {
    this['data-view'].like();
  } };

p._createDom = function(markup) {
  this.dom = v(def);
};

p.like = function(id) {
  if (this.isLoading) return;
  this.isLoading = true;
  this.value.toggleLike(u.bind(this._success, this));
};

p._success = function(result) {
  this.isLoading = false;
  this.state = !this.state;
};

Object.defineProperties(p, {
  isLoading: {
    get: function() {
      return u.cls.has(this, CLS('m-like_loading'));
    },
    set: function(state) {
      u.cls.toggle(this, CLS('m-like_loading m-bg-loading'), state);
    }
  },
  state: {
    get: function() {
      return this._state;
    },
    set: function(state) {
      this._state = state;
      this.dom.textContent = state ? tx('common:unlike') : tx('common:like');
    }
  }
});

p.value = null;
