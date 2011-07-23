/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
requireCss('./comment.css');

var v = require('muv/v');
var u = require('muv/u');
var tx = require('app/lib/tx');

var Post = module.exports = require('app/view/composable').createClass();
var p = Post.prototype;

p.defaultClassName = CLS('m-comment m-image-block');

p.compose = function() {
  this.refs = {};
  var r = v({ fragment: true, children: [
    { tag: 'img', className: CLS("m-comment-pic m-image-block-left"),
      src: this.value.from.pic_square
    },
    { tag: 'div', className: CLS('m-image-block-content'), children: [
      { tag: 'a', className: CLS('m-comment-from'),
        text: this.value.from.name,
        href: this.value.from.url },
      { text: ' ' + this.value.text },
      { tag: 'div', className: CLS('m-comment-actions'), children: [
        { view: require('app/view/timestamp/timestamp'), tag: 'span',
          value: this.value.datetime },
        { text: ' \u00B7 '},
        { view: require('app/view/like/comment'), value: this.value,
          as: 'like' },
        { view: Count, model: this.value }
      ] }
    ] },
    { tag: 'div', className: CLS('clear') }
  ] }, this);
  return r;
};

var Count = v.Base.createClass();
var cp = Count.prototype;
cp._createDom = function() {
  this.dom = v({ tag: 'span', children: [
    { text: ' \u00B7 '},
    { tag: 'a', href: '#', className: CLS('m-comment-like-count'), as: 'likesCount'}
  ]}, this)
};

Object.defineProperty(cp, 'value', {
  get: function() {
    return this._value.likes;
  },
  set: function(value) {
    this._value = value;
    this.likesCount.textContent = value.likes;
    u.cls.toggle(this, CLS('hidden'), !(value.likes*1));
  }
})

cp.defaultBindingOptions = {
  modelEvents: ['change.likes'],
  modelProp: ''
};
