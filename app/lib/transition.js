requireCss('./transition.css');

var u = require('muv/u');

module.exports = function(wrapper, a, b, isForward, targetScrollTop, callback) {
  if (1 || a.style.webkitTransform === undefined) {
    wrapper.appendChild(b);
    a.parentNode.removeChild(a);
    setTimeout(function() {
      window.scrollTo(0, targetScrollTop);
    }, 1);
    callback();
    return;
  }
  var width = a.offsetWidth;
  var scrollTop = document.body.scrollTop;
  var wrapperOffset = wrapper.offsetTop;
  wrapper.style.cssText +=
    'position:absolute;overflow:hidden;' +
    // 'top:' + (targetScrollTop) + 'px;height:' + screen.height + 'px;' +
    'top:' + (wrapperOffset) + 'px;height:' + document.body.offsetHeight + 'px;' +
    'left:' + (isForward ? 0 : -width) + 'px;' +
    'width:' + 2*width + 'px';

  a.style.cssText +=
    ';position:absolute;' + 
    // 'top:' + (-scrollTop + wrapperOffset) + 'px;' +
    'left:' + (isForward ? 0 : width) + 'px;' +
    'width:' + width + 'px';

  b.style.cssText +=
    ';position:absolute;' +
    // 'top:' + (wrapperOffset - targetScrollTop) + 'px;' +
    'left:' + (isForward ? width : 0) + 'px;' +
    'width:' + width + 'px';
  wrapper.appendChild(b);
  
  document.body.offsetHeight;

  // window.scrollTo(0, targetScrollTop);
  wrapper.style.WebkitTransition = "-webkit-transform 0.5s ease-in-out";
  setTimeout(function() {
    // window.scrollTo(0, targetScrollTop);
    setTimeout(function() {
      wrapper.style.WebkitTransform = 'translate3d(' + (isForward ? -width : width) + 'px, 0, 0)';
    }, 1);
  }, 1);
  
  wrapper.addEventListener('webkitTransitionEnd', function end() {
    wrapper.removeEventListener('webkitTransitionEnd', end);
    a.parentNode.removeChild(a);
    a.style.position = a.style.width = a.style.height = a.style.left = '';
    b.style.position = b.style.width = b.style.height = b.style.left = '';
    wrapper.style.WebkitTransition = wrapper.style.WebkitTransform =
      wrapper.style.position = wrapper.style.width = wrapper.style.height = '';
    window.scrollTo(0, targetScrollTop);
    callback();
  });

};