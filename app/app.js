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
        { tag: 'div', className: CLS('m-container'), as: 'container' }
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
        app.goTo({ name: data.name, options: data.options }, true);
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
  var state = currentController.parentState || currentController.defaultParentState;
  if (state) { app.goTo(state, false); }
};

window.addEventListener('popstate', function(e) {
  if (e.state) {
    var isForward = e.state.meta.depth > app.state.meta.depth;
    app.state = e.state;
    app.transitionTo(e.state, isForward);
  }
});

function generateMeta(deptOffset) {
  var depth = ('depth' in app.state.meta) ? app.state.meta.depth : 0;
  return { top: document.body.scrollTop, depth: depth + deptOffset };
}

app.replaceState = function(state) {
  var meta = generateMeta(0);
  app.state = { name: state.name, options: state.options, meta: meta };
  history.replaceState(this.state, null, buildUrl(this.state));
};

app.pushState = function(state, deptOffset) {
  var meta = generateMeta(1);
  app.state = { name: state.name, options: state.options, meta: meta };
  // history.pushState(this.state, null, buildUrl(this.state));
};

app.transitionTo = function(state, isForward) {
  state.meta = state.meta || {};
  var newController = app.getController(state.name, state.options);

  if (!currentController || newController === currentController) {
    currentController = newController;
    app.container.appendChild(newController.container);
    document.body.scrollTop = state.meta.top;
  } else {
    var transition = require('./lib/transition');
    transition(
      app.container,
      currentController.container,
      newController.container,
      isForward,
      state.meta.top || 0,
      function() {
        currentController = newController;
        if (isForward) { 
          newController.parentState = app.state;
          app.pushState(state); 
        } else {
          app.replaceState(state); 
        }
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

app.goTo = function(state, isForward) {
  app.replaceState(app.state);
  app.transitionTo(state, isForward);
};

function buildUrl(state) {
  if (state.name === 'home') return '/';
  var parts = [];
  for (var i in state.options) {
    var value = state.options[i];
    if (u.is.scalar(value)) {
      parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(value));
    }
  }
  return '/' + state.name + '/' + (parts.length ? '?' + parts.join('&') : '');
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
  var state = { name: name, options: options };
  app.replaceState(state, 0);
  app.transitionTo(state);
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

