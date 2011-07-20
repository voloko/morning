requireCss('./app.css');
var v = require('../muv/v');
var u = require('../muv/u');

var app = global.app = module.exports = {};

var controllers = {};
var controller = null;

app.init = function() {
  var refs = {};

  document.head.appendChild(
    v({ tag: 'style', text: __requiredCss })
  );

  document.body.appendChild(
    v({ fragment: true, children: [
      { view: require('./view/navbar/navbar'), as: 'navbar' },
      { view: require('./view/footer/footer'), as: 'footer' }
    ]}, app)
  );

  require('sync/postSync').restoreCache();

  document.body.addEventListener('click', function(e) {
    var target = e.target;
    while (target) {
      var data = target['data-goTo'];
      if (data) {
        e.preventDefault();
        app.goTo(data.name, data.options);
        break;
      }
      target = target.parentNode;
    };
  });

  setTimeout(function() {
    app.goTo('home');
    alignWindow();
  });
};

u.delegate.prop(app, 'title', 'navbar');

app.apiReady = function() {
  require('./lib/api').init();
};

app.goTo = function(name, options, restoredFromHistory) {
  options = options || {};
  if (!restoredFromHistory) {
    var url = buildUrl(name, options);
    var state = { name: name, options: options };
    state.view = { scrollTop: document.body.scrollTop };
    if (!controller) {
      history.replaceState(state, null, url);
    } else if (url != location.pathname) {
      history.pushState(state, null, url);
    }
  }
  if (controller) {
    controller.container.parentNode.removeChild(controller.container);
  }

  if (controllers[name]) {
    controller = controllers[name];
    document.body.insertBefore(controller.container, app.footer.dom);
    controller.update(options);
  } else {
    var container = v({ tag: 'div', className: 'm-container' });
    document.body.insertBefore(container, app.footer.dom);
    var controllerClass = getController(name);
    controllers[name] = controller = new controllerClass();
    controller.show(container, options);
  }
  document.title = app.title = controller.title;
  if (!restoredFromHistory) {
    alignWindow();
  }
};

window.addEventListener('load', alignWindow);

window.addEventListener('popstate', function(e) {
  if (e.state) {
    app.goTo(e.state.name, e.state.options, true);
    document.body.scrollTop = e.state.viewport.scrollTop;
  }
});

function buildUrl(name, options) {
  if (name === 'home') return '/index.html';
  var parts = [];
  for (var i in options) {
    var value = options[i];
    if (u.is.scalar(value)) {
      parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(value));
    }
  }
  return '/' + name + '/' + (parts.length ? '?' + parts.join('&') : '');
}

function getController(name) {
  switch(name) {
    case 'home': return require('./controller/home');
    case 'post': return require('./controller/post');
  }
  return null;
}


function alignWindow() {
  setTimeout(function(){
    window.scrollTo(0, 1);
  }, 1);
}

