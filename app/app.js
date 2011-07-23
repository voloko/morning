/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
requireCss('./app.css');
global.console = global.console || function() {};
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
      var data = target['data-click-action'];
      if (data) {
        e.preventDefault();
        target['data-click-action']();
        break;
      }
      target = target.parentNode;
    };
  });

  setTimeout(function() {
    extactStateFromUrl();
    alignWindow();
  }, 1);
};

app.state = { meta: {} };

app.apiReady = function() {
  require('./lib/api').init();
};

app.goBack = function() {
  if (currentController.isHome) { return; }

  // use browser history when available
  if (currentController.parentState) {
    history.back();
    return;
  }
  var state = currentController.parentState ||
    currentController.defaultParentState;
  if (state) {
    replaceState(app.state, true);
    transitionTo(state, false);
  }
};

app.goTo = function(state, addToBrowserHistory) {
  replaceState(app.state);
  transitionTo(state, true, addToBrowserHistory);
};

window.addEventListener('popstate', function(e) {
  if (e.state) {
    var isForward = e.state.meta.depth > app.state.meta.depth;
    app.state = e.state;
    transitionTo(e.state, isForward);
  }
});

function generateMeta(deptOffset) {
  var depth = ('depth' in app.state.meta) ? app.state.meta.depth : 0;
  return { top: document.body.scrollTop, depth: depth + deptOffset };
}

function replaceState(state) {
  var meta = generateMeta(0);
  app.state = { name: state.name, options: state.options, meta: meta };
  history.replaceState(app.state, null, buildUrl(app.state));
};

function pushState(state, deptOffset, addToBrowserHistory) {
  var meta = generateMeta(1);
  app.state = { name: state.name, options: state.options, meta: meta };
  addToBrowserHistory &&
    history.pushState(app.state, null, buildUrl(app.state));
};

function transitionTo(state, isForward, addToBrowserHistory) {
  state.meta = state.meta || {};
  var newController = getController(state.name, state.options);

  if (!currentController) {
    currentController = newController;
    app.container.appendChild(newController.container);
    window.scrollTo(0, state.meta.top);
    app.updateTitle();
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
          pushState(state, isForward ? 1 : -1, addToBrowserHistory);
        } else {
          replaceState(state);
        }
        app.updateTitle();
    });
  }
};

app.updateTitle = function() {
  app.navbar.title = currentController.isHome ? '' : currentController.title;
  app.navbar.isHome = currentController.isHome;
  document.title = currentController.title;
};

function getController(name, options) {
  if (controllers[name]) {
    controllers[name].update(options);
  } else {
    var container = v({ tag: 'div', className: CLS('m-container-item') });
    var controllerClass = getControllerClass(name);
    controllers[name] = new controllerClass();
    controllers[name].show(container, options);
  }
  return controllers[name];
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
  replaceState(state);
  transitionTo(state);
}

function getControllerClass(name) {
  switch(name) {
    case 'home': return require('./controller/home');
    case 'post': return require('./controller/post');
    case 'profile': return require('./controller/profile');
  }
  return null;
}


function alignWindow() {
  setTimeout(function(){
    window.scrollTo(0, 1);
  }, 1);
}
//
// console.log(require('app/sync/userSync').getFriendsFromCache().length);
//
// console.log(require('app/lib/api')
//  .method({ method: 'users.getContactInfo'}, function(c) {
//   console.log(c);
// }));
//
