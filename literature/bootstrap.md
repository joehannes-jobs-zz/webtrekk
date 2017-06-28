# Bootstrapping the Application

What I call the bootstrapping chapter of this little piece of art,
consists of 3 distinct parts

* [app/app.js](#Main-Entry-Point "save:")
* [app/module.js](#Main-AngularJS-Module "save:")
* [app/routes.js](#Routing "save:")

While the main entry point configures the Module
and triggers AngularJS bootstrapping
* the Module itself lives in its own file
* as does the bigger part of the configuration in form of the Routing

I'm using my very own [ng-harmony](http://www.github.com/ng-harmony) libs here,
which
* encapsulate the usual bootstrapping in a Helper-Class
* uses an easy json-Object convenience mechanism for Routing
* exposes the config, bootstrap methods of angular to serve your demands

Apart from that different parts of the ng-harmony libs do allow
for certain features in AngularJS with a decent setup:
eg: (BabelJS, ES6 Modules, Webpack/SystemJS) ...
* decorators
* in controller eventing
* Base Classes, Utilities and Mixins
* ...

We'll come across this features in the nick of time ...

_Let's kick this off as a story told reasonably and not necessarily in the sense of file structure_ :)

### Let's consider our routes ...

* Where will AngularJS take you to once the Application starts?
* What's the navigational structure after allow

Given the (specs)[/README.md] we can conclude we got 3 views:
* The landing page is the _customer overview_
* One can navigate to the _details_, which is a separate page
* As to not leave the _details_ such a lonely Asset, there comes the _navigation data_ to the rescue

## Routing

Now those pages don't only need a configuration, they also need templates,
so let's import those _pug_-templates!
(Pug is the successor of jade, a templating engine
which is to HTML just what _Sass_ is to _CSS_)
Then, let's declare the routes!

```js
import OverviewPageTpl from "../views/overview.pug";
import DetailsPageTpl from "../views/details.pug";
import NavigationPageTpl from "../views/navigation.pug";

const routes = {
	default: {
		controller: "OverviewPageCtrl",
		template: OverviewPageTpl,
	},
	"/detail/:id": {
		controller: "DetailsPageCtrl",
		template: DetailsPageTpl,
	},
	"/navigation/:id": {
		controller: "NavigationPageCtrl",
		template: NavigationPageTpl,
	}
};

export default routes;
```

## Main AngularJS Module

Now let's have look at the Module initilization
First, let's import all the stuff we include and need in our Module
Then let's initialize the Module with its dependencies :) Easy :)

```js
import "angular";
import "angular-route";
import "angular-animate";
import { Module } from "ng-harmony-module";

//TODO import bootstrap components here!

let deps = [
	'ngRoute',
	'ngAnimate',
];
var module = new Module('webtrekk', deps);

export default module;
```

## Main Entry Point

Now that everything is prepared we can go ahead and kickoff/bootstrap!

```js
import "../../assets/styles/main.sass";

import module from "./module";
import routes from "./routes";

import "./pages/overview"
import "./pages/overview.sass"

import "./pages/details"
import "./pages/details.sass"

import "./pages/navigation"
import "./pages/navigation.sass"

module.routing(routes);
module.config(($locationProvider) => {
	$locationProvider.html5Mode(false);
});
module.bootstrap();

export default module.name;
```
