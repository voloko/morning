requireCss('./post.css');
requireCss('./attachment.css');
requireCss('../image-block/image-block.css');

var v = require('muv/v');
var u = require('muv/u');

var PostAttachment = module.exports =
  require('app/view/composable').createClass();
var p = PostAttachment.prototype;

p.defaultClassName = CLS('m-post-attch m-image-block');

p.compose = function() {
  var value = this.value;
  var media = this.value.media;
  u.cls.toggle(
    this,
    CLS('u-post-attch_multi-media'),
    media && media.length > 1);

  return v({ fragment: true, children: [
    this.composeMedia(media),

    { tag: 'div', className: CLS("m-post-attch-content m-image-block-content"),
      children: [
      { tag: 'a', className: CLS('m-post-attch-name'), href: value.href,
        text: value.name, target: '_blank' },
      value.caption && { tag: 'div', className: CLS('m-post-attch-caption'),
        text: value.caption },
      value.description && { tag: 'div',
        className: CLS('m-post-attch-description'), text: value.description }
    ]},

    { tag: 'div', className: CLS('clear') }
  ] });
};

p.composeMedia = function(media) {
  if (media && media.length && media[0].src) {
    u.cls.remove(this, CLS('u-post-attch_without-media'));
    var children = media.map(function(media) {
      return v({ tag: 'a', href: media.href,
        className: CLS("m-post-attch-media m-image-block-left"),
        target: '_blank', children: [
        { tag: 'img', className: CLS('m-post-attch-icon-img'), src: media.src }
      ] });
    });
    return v({ fragment: true, children: children });
  } else {
    u.cls.add(this, CLS('u-post-attch_without-media'));
    return null;
  }
};
