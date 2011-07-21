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
        { tag: 'a', href: '#', className: CLS('m-comment-like'), text: tx('cmt:like'), as: 'like' }
      ] }
    ] },
    { tag: 'div', className: CLS('clear') }
  ] }, this);
  this.updateLikes();
  return r;
};


p.updateLikes = function() {
  if (this.value.likes*1) {
    if (this.likesCount) {
      this.likesCount.innerHTML = this.value.likes;
    } else {
      this.like.parentNode.appendChild(v({ fragment: true, children: [
        { text: ' \u00B7 '},
        { tag: 'a', href: '#', className: CLS('m-comment-like-count'), text: this.value.likes,
          as: 'likesCount'}
      ]}, this))
    }
  }
};
