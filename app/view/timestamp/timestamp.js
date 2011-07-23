/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
requireCss('./timestamp.css');

var timeSince = require('app/lib/timeSince');
var v = require('muv/v');

var Timestamp = module.exports = v.Base.createClass();
var p = Timestamp.prototype;

p.defaultClassName = 'm-timestamp';

Object.defineProperty(p, 'value', {
  configurable: true,
  set: function(value) {
    this._value = value;
    this.dom.innerHTML = value && timeSince(value);
  },
  get: function() {
    return this._value;
  }});
