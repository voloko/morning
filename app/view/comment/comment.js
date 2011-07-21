requireCss('./comment.css');

var v = require('muv/v');
var u = require('muv/u');

var Post = module.exports = require('app/view/composable').createClass();
var p = Post.prototype;

p.defaultClassName = CLS('m-comment m-image-block');

p.compose = function() {
  this.refs = {};
  return v({ fragment: true, children: [
    { tag: 'img', className: CLS("m-comment-pic m-image-block-left"),
      src: this.value.from.pic_square
    },
    { tag: 'div', className: CLS('m-image-block-content'), text: this.value.text },
    { tag: 'div', className: CLS('clear') }
  ] });
};
