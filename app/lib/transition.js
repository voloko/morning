requireCss('./transition.css');

var u = require('muv/u');

module.exports = function(wrapper, a, b, isForward, callback) {
  if (a.style.webkitTransform === undefined) {
    callback();
    return;
  }

  var cls = isForward ? 'fwd' : 'bwd';
  var offset = a.offsetWidth;

  u.cls.add(wrapper, 'm-transition m-transition_wrapper');
  b.style.left = (isForward ? offset : -offset) + 'px';
  b.style.width = offset + 'px';
  u.cls.add(b, 'm-transition_in');

  wrapper.addEventListener('webkitTransitionEnd', function end() {
    wrapper.removeEventListener('webkitTransitionEnd', end);
    callback();
    u.cls.remove(wrapper, 'm-transition');
    wrapper.style.WebkitTransform = '';
    b.style.left = '';
    b.style.width = '';
    u.cls.remove(b, 'm-transition_in');
  });

  setTimeout(function() {
    wrapper.style.WebkitTransform = 'translate3d(' + (isForward ? -offset : offset) + 'px, 0, 0)';
  }, 1);
};