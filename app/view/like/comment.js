requireCss('./like.css');
requireCss('../bg/bg.css');

var v = require('muv/v');
var u = require('muv/u');

var Like = module.exports = require('./like').createClass();
var p = Like.prototype;

Object.defineProperties(p, {
  value: {
    get: function() {
      return this._value;
    },
    set: function(value) {
      this._value = value;
      this.object_id = value.id;
      this.state = value.user_likes;
    }
  }
});

p._success = function(result) {
  this.isLoading = false;
  this.state = this.value.user_likes;
};
