# Bootstapping the App

What I call the bootstrapping chapter of this lil piece of art,
consists of 3 distinct parts

* [/build/app/app.js](#Main-Entry-Point "save:")
* [/build/app/module.js](#Main-AngularJS-Module "save:")
* [/build/app/routes.js](#Routing "save:")

While the main entry point configures the Module and triggers angularjs bootstrapping
* the Module itself lives in its own file
* as does the bigger part of the config in form of the Routing

I'm using my very own [ng-harmony](http://www.github.com/ng-harmony) libs here, which
* encapsulate the usual bootstrapping in a Helper-Class
* uses an easy json-Object convenience mechanism for Routing
* exposes the config, bootstrap methods of angular to serve your demands

Apart from that different parts of the ng-harmony libs do allow for certain features in AngularJS with a decent setup (BabelJS, ES6 Modules, Webpack/SystemJS) ...
* decorators
* in controller eventing
* Base Classes, Utilities and Mixins
* ...

We'll come across this features in the nick of time ...

_Let's kick this off as a story told reasonably and not necessarily in the sense of file structure_ :)

### Let's consider our routes ...

* Where will angularjs take you to once the app starts?
* What's the navigational structure after allow

Given the (specs)[/README.md] we can conclude we got 3 views:
* The landing page is the _customer overview_
* One can navigate to the _details_, which is a separate page
* As to not leave the _details_ such a lonely Asset, there comes the _navigation data_ to the rescue

## Routing

Now those pages don't only need a config, they also need templates, so let's import those _pug_-templates (Pug is the successor of jade, a templating engine which is to HTML just what _Sass_ is to _CSS_)
Then, let's declare the routes

```js
	import OverviewPageTpl from "/build/views/overview.pug";
	import DetailsPageTpl from "/build/views/details.pug";
	import NavigationPageTpl from "/build/views/navigation.pug";

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
	import "angular-loading-bar";
	import { Module } from "ng-harmony-module";

	//TODO import bootstrap components here!

	let deps = [
		'ngRoute',
		'ngAnimate',
		'angular-loading-bar'
	];
	var module = new Module('webtrekk', deps);

	export default module;
```

## Main Entry Point

Now that everything is prepared we can go ahead and kickoff/bootstrap!

```js
	import "/assets/styles/main.sass";

	import module from "./module";
	import routes from "./routes";

	module.routing(routes);
	module.config(($locationProvider) => {
		$locationProvider.html5Mode(false);
	});
	module.bootstrap();

	export default module.name;
```
