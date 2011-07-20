requireCss('./transition.css');

var u = require('../../muv/u');

module.exports = function(wrapper, a, b, isForward, callback) {
  if (a.style.webkitTransform === undefined) {
    callback();
    return;
  }

  var cls = isForward ? 'fwd' : 'bwd';
  u.cls.add(wrapper, 'm-transition m-transition_wrapper');
  u.cls.add(b, 'm-transition_in_' + cls);
  b.style.width = a.offsetWidth + 'px';
  
  wrapper.addEventListener('webkitTransitionEnd', function end() {
    wrapper.removeEventListener('webkitTransitionEnd', end);
    callback();
    u.cls.remove(wrapper, 'm-transition m-transition_out_' + cls);
    u.cls.remove(b, 'm-transition_in_' + cls);
    b.style.width = '';
  });

  setTimeout(function() {
    u.cls.add(wrapper, 'm-transition_out_' + cls);
  }, 1);
};