requireCss('./transition.css');

var u = require('../../muv/u');

module.exports = function(a, b, isForward, callback) {
  if (a.style.webkitTransform === undefined) {
    callback();
    return;
  }

  var parent = a.parentNode;
  var cls = isForward ? 'fwd' : 'bwd';
  u.cls.add(parent, 'm-transition');
  u.cls.add(b, 'm-transition_in_' + cls);
  b.style.width = a.offsetWidth + 'px';

  parent.addEventListener('webkitTransitionEnd', function end() {
    parent.removeEventListener('webkitTransitionEnd', end);
    callback();
    u.cls.remove(parent, 'm-transition m-transition_out_' + cls);
    u.cls.remove(b, 'm-transition_in_' + cls);
    b.style.width = '';
  });

  setTimeout(function() {
    u.cls.add(parent, 'm-transition_out_' + cls);
  }, 1);
};