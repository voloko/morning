requireCss('./app.css');
var v = require('muv/v');
var u = require('muv/u');

var app = global.app = module.exports = {};

var controllers = {};
var currentController = null;

app.init = function() {
  var refs = {};

  document.head.appendChild(
    v({ tag: 'style', text: __requiredCss })
  );

  document.body.appendChild(
    v({ fragment: true, children: [
      { view: require('./view/navbar/navbar'), as: 'navbar' },
      { tag: 'div', style: 'overflow-x: hidden', children: [
        { tag: 'div', className: 'm-container', as: 'container' }
      ]},
      { view: require('./view/footer/footer'), as: 'footer' }
    ]}, app)
  );

  document.body.addEventListener('click', function(e) {
    var target = e.target;
    while (target) {
      var data = target['data-goTo'];
      if (data) {
        e.preventDefault();
        app.goTo(data.name, data.options, true);
        break;
      }
      target = target.parentNode;
    };
  });

  setTimeout(function() {
    extactStateFromUrl();
    alignWindow();
  });
};

app.state = { meta: {} };

app.apiReady = function() {
  require('./lib/api').init();
};

app.goBack = function() {
  if (currentController.isHome) { return; }
  if (!currentController.isFirst) {
    app.goTo(currentController.parentStateName, currentController.parentStateOptions, false);
  } else {
    history.back();
  }
};

window.addEventListener('popstate', function(e) {
  if (e.state) {
    var isForward = e.state.meta.guid > app.state.meta.guid;
    app.state = e.state;
    app.transitionTo(e.state.name, e.state.options, isForward);
  }
});


app.storeState = function(name, options, firstTime) {
  var url = buildUrl(name, options);
  var state = { name: name, options: options };
  state.meta = { guid: u.guid++ };
  if (firstTime) {
    history.replaceState(state, null, url);
  } else if (url != location.pathname) {
    history.pushState(state, null, url);
  }
  app.state = state;
};

app.transitionTo = function(name, options, isForward) {
  var newController = app.getController(name, options);
  app.container.appendChild(controllers[name].container, app.footer.dom);
  if (!currentController) {
    currentController = newController;
  } else {
    var transition = require('./lib/transition');
    currentController.transitionOutStart();
    newController.transitionInStart();
    transition(app.container, currentController.container, newController.container, isForward, function() {
      currentController.container.parentNode.removeChild(currentController.container);
      currentController.transitionOutEnd();
      newController.transitionInEnd();
      currentController = newController;
    });
  }
  app.navbar.title = newController.isHome ? '' : newController.title;
  app.navbar.isHome = newController.isHome;
  document.title = newController.title;
};

app.getController = function(name, options) {
  if (controllers[name]) {
    controllers[name].update(options);
  } else {
    var container = v({ tag: 'div' });
    var controllerClass = getControllerClass(name);
    controllers[name] = new controllerClass();
    controllers[name].show(container, options);
  }
  return controllers[name];
};

app.goTo = function(name, options, isForward) {
  app.storeState(name, options);
  app.transitionTo(name, options, isForward);
};

function buildUrl(name, options) {
  if (name === 'home') return '/';
  var parts = [];
  for (var i in options) {
    var value = options[i];
    if (u.is.scalar(value)) {
      parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(value));
    }
  }
  return '/' + name + '/' + (parts.length ? '?' + parts.join('&') : '');
}

function extactStateFromUrl() {
  var name = location.pathname.replace(/\//g, '');
  var options = {};
  location.search.split(/\?|&/).forEach(function(pair) {
    if (pair) {
      var match = pair.match(/([^=]+)=(.*)/);
      options[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    }
  });

  var controller = getControllerClass(name);
  if (!controller) {
    name = 'home';
    options = {};
  }
  app.storeState(name, options, true);
  app.goTo(name, options);
}

function getControllerClass(name) {
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

