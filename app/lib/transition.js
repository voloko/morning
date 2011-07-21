requireCss('./transition.css');

var u = require('muv/u');

module.exports = function(wrapper, a, b, isForward, targetScrollTop, callback) {
  if (a.style.webkitTransform === undefined) {
    wrapper.appendChild(b);
    callback();
    return;
  }
  var width = a.offsetWidth;
  var scrollTop = document.body.scrollTop;
  var wrapperOffset = wrapper.offsetTop;
  wrapper.style.cssText +=
    ';-webkit-transition: -webkit-transform 0.5s ease-in-out;' +
    'position:absolute;overflow:hidden;' +
    'top:' + (targetScrollTop) + 'px;height:' + screen.height + 'px;' +
    'left:' + (isForward ? 0 : -width) + 'px;' +
    'width:' + 2*width + 'px';

  a.style.cssText +=
    ';position:absolute;top:' + (-scrollTop + wrapperOffset) + 'px;' +
    'left:' + (isForward ? 0 : width) + 'px;' +
    'width:' + width + 'px';

  b.style.cssText +=
    ';position:absolute;' +
    'top:' + (wrapperOffset - targetScrollTop) + 'px;' +
    'left:' + (isForward ? width : 0) + 'px;' +
    'width:' + width + 'px';
  wrapper.appendChild(b);
  
  document.body.scrollTop = targetScrollTop;

  setTimeout(function() {
    document.body.scrollTop = targetScrollTop;
    wrapper.style.WebkitTransform = 'translate3d(' + (isForward ? -width : width) + 'px, 0, 0)';
  }, 1);
  
  wrapper.addEventListener('webkitTransitionEnd', function end() {
    wrapper.removeEventListener('webkitTransitionEnd', end);
    a.parentNode.removeChild(a);
    a.style.position = a.style.width = a.style.height = a.style.left = '';
    b.style.position = b.style.width = b.style.height = b.style.left = '';
    wrapper.style.WebkitTransition = wrapper.style.WebkitTransform =
      wrapper.style.position = wrapper.style.width = wrapper.style.height = '';
    callback();
  });

};