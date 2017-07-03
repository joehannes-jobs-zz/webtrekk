# Chapter pages

Pages are root components with all their assets (styling, templates).
They correlate to routes in a 1:1 manner (almost, we got an alias as well).

### Let's revise

Given the [specs](/README.md) we can conclude we got 3 views:
* The landing page is the _customer overview_
* One can navigate to the _details_, which is a separate page
* As to not leave the _details_ such a lonely Asset, there comes the _navigation data_ to the rescue

Let's kick off with the _Landing Page_, which is the customer overview.

# Landing Page aka Customer Overview

It consists of
* [views/overview.pug](#Overview-View "save:")
* [app/pages/overview.sass](#Overview-PageStyles "save:")
* [app/pages/overview.js](#Overview-PageCtrl "save:")
* [app/pages/overview.spec.js](#Overview-Page-Unit-Tests "save:")

## Overview View

Here again the reference image:

![customer overview](/assets/docs/overview.png)

Pretty Simple :)

```pug
header.page-header.row
	.col-md-3 &nbsp;
	.col-md-6: h1#overview-header Customer Overview
	.col-md-3 &nbsp;
.row
	.col-md-3 &nbsp;
	article.panel.panel-primary.col-md-6
		.panel-heading
			label.btn.btn-default(ng-click="$goToAddCustomer()") Add New Customer
			.pull-right
				.btn-group(role="group")
					label.btn.btn-default(ng-click="$goToEditCustomer()" ng-disabled="$selection()") Edit
					label.btn.btn-danger(ng-click="$deleteActiveCustomer()" ng-disabled="$selection()") Delete
				span.spacer-10 &nbsp;
				label.btn.btn-default(ng-click="$goToNaviData()" ng-disabled="$selection()") Navi
		customers(model="{{model}}").panel-body
	.col-md-3 &nbsp;
```

## Overview PageStyles

```sass
h1#overview-header
	font-weight: bold

article.panel
	padding-left: 0
	padding-right: 0
	box-shadow: 0px 10px 25px 5px rgba(150, 150, 150, 0.5)
```

## Overview PageCtrl

Let's get the party started!

```js
import "./overview.sass";

import { Controller as Ctrl } from "ng-harmony-core";
import { Controller, Logging } from "ng-harmony-decorator";

import * as Config from "../../../assets/data/config.global.json";
```

Now that we've imported our
* Base class
* Decorators in style of Angular.Next
* Global Config (which we use in the Logger)

we can
* declare the Ctrl in a breeze
* add business functionality as usual in OO-style

```js
@Controller({
	module: "webtrekk",
	name: "OverviewPageCtrl",
	deps: ["CustomerService", "$location"]
})
@Logging({
	loggerName: "OverviewPageLogger",
	...Config
})
export class OverviewPageCtrl extends Ctrl {
	constructor (...args) {
		super(...args);

		this.$scope.model = [];
		this.initialize();
	}
```

On Init is asynchronouse, since we fetch data from the local db which is async itself.
I choose to iterate overe the _rxdb-result_ with _forEach_ instead of _map_ as it's
more convenient since key-names change (customer_id -> id).
After pushing to the model I use the inherited convenience function *_digest()*
in order to trigger a digest cycle reliable, as angularjs sometimes get's confused
on all that custom stuff.

```js
	async initialize () {
		let customers = await this.CustomerService.fetchCustomers();
		customers && customers.forEach((customer) => {
			this.$scope.model.push({
				id: customer.customer_id,
				first_name: customer.first_name,
				last_name: customer.last_name,
				age: this.transformBirthday(customer.birthday),
				gender: customer.gender,
				last_contact: customer.last_contact,
				customer_lifetime_value: customer.customer_lifetime_value,
			});
		});
		this._digest();
	}
```

When transforming the Time-Birthday-String to an actual age in years, I
* Math.floor of course
* rely on Date for transforming the initial string
* approximate lightyears by adding a .25 to the final dividor

```js
	transformBirthday (time) {
		return Math.floor((new Date().getTime() - new Date(time).getTime()) / 1000 / 3600 / 24 / 365.25);
	}
```

I usually try to avoid binding to functions, but since it needs to iterate an array there
seems to be no way around it.
Well, if there is one dataset with an active attribute, the edit/delete/navi buttons should be activated.

*Also, the function has a $-prefix*:
This adds the function to the $scope and makes it accessible to the template

```js
	$selection () {
		return this.$scope.model.filter((ds) => ds.active).length === 0;
	}
```

To get the active id, the _reduce_ function comes in quite handy as we iterate over numbers.
To be on the safe side I convert any possible stringNumber to a pure Number by preixing _b.id_.

```js
	_getActiveId () {
		return this.$scope.model.reduce((a, b) => {
			return b.active ? a + +b.id : a;
		}, 0);
	}
```

Those _goToPage_-Methods are pretty easy/self-explanatory.
Cast an eye on the $-prefix again, so they are on $scope!

```js
	$goToAddCustomer () {
		this.$location.path("/add");
	}

	$goToEditCustomer () {
		let id = this._getActiveId();
		this.$location.path(`/detail/${id}`);
	}

	$goToNaviData () {
		let id = this._getActiveId();
		this.$location.path(`/navigation/${id}`);
	}
```

I don't go for optimistic UI here, as it wasn't asked for ...
Anyway, splicing out the reduced index is pretty funky.

```js
	async $deleteActiveCustomer() {
		let id = this._getActiveId();
		await this.CustomerService.deleteCustomer(id);
		this.$scope.model.splice(this.$scope.model.reduce((a, b, i) => {
			return b.active ? a + i : a;
		}, 0), 1);
		this._digest();
	}
}
```

## Overview Page Unit Tests

```js
import Module from "../app";
import { OverviewPageCtrl } from "./overview";

import CustomerPayload from "../../../assets/data/customer.payload.json";

describe("OverviewPage", () => {
    describe("OverviewPageCtrl", () => {
        var ctrl, $scope;

        beforeEach(() => {
            angular.mock.module(Module);
			angular.mock.module(($provide) => {
				$provide.service("CustomerService", class CustomerServiceMock {
					async fetchCustomers () {
						return CustomerPayload.data;
					}
				});
			});

            inject(($controller, $rootScope, $location, CustomerService) => {
                $scope = $rootScope.$new();
                ctrl = $controller("OverviewPageCtrl", {
					$scope,
					$location,
					CustomerService
				});
            });
        });

        it("should have it's proper name", () => {
            expect(ctrl.constructor.name).toBe("OverviewPageCtrl");
        });

		it("should transform birthdays to age", () => {
            let age = ctrl.transformBirthday(CustomerPayload.data[0].birthday);
            expect(age > 0 && age < 121).toBeTruthy();
        });

		it("should recognize no dataset is active since none is loaded", () => {
            expect(ctrl._getActiveId()).toEqual(0);
        });
    });
});
```

# Time to add some detail

It consists of
* [views/details.pug](#Details-View "save:")
* [app/pages/details.sass](#Details-PageStyles "save:")
* [app/pages/details.js](#Details-PageCtrl "save:")

## Details View

Here again the reference image:

![customer overview](/assets/docs/details.png)

Pretty Simple :)

```pug
header.page-header.row
	.col-md-3 &nbsp;
	.col-md-6: h1#details-header {{heading}}
	.col-md-3 &nbsp;
.row
	.col-md-3 &nbsp;
	customer-form(model="{{model}}").panel.panel-primary.col-md-6
	.col-md-3 &nbsp;
```

## Details PageStyles

You know, this little sass duplication really isn't necessary.
I just wanted to make sure I don't run into trouble with an empty sass-file

```sass
h1#details-header
	font-weight: bold
```

## Details PageCtrl

Now let's have a look at the Details/Edit/Add-Page Ctrl
It has a pretty huge init-method with some funky syntax usage, let's dig into it :)

```js
import "./details.sass";

import { Controller as Ctrl } from "ng-harmony-core";
import { Controller, Logging } from "ng-harmony-decorator";

import * as Config from "../../../assets/data/config.global.json";
```

Before we kick off I want you to not easily overlook the Route-resolve-observedModel ...
which is passed in as a service :)

```js
@Controller({
	module: "webtrekk",
	name: "DetailsPageCtrl",
	deps: ["CustomerService", "observedModel"],
})
@Logging({
	loggerName: "DetailsPageLogger",
	...Config,
})
export class DetailsPageCtrl extends Ctrl {
	constructor (...args) {
		super(...args);

		this.$scope.model = {};
		this.initialize();
	}
```

When hacking away at the routing alias ... one might say I should have
used two separate Controllers for the aliased route (*/add 'n /details/:id*).

At that point I basically wanted to keep the base functionality common,
as I didn't know yet how the thing would turn out.
* Would it become a large class?
* Why not simply reuse the same class anyway?

So, as we have it here, I got an initial if(/else) depending on the route(-alias).

```js
	async initialize () {
		if (this.observedModel && this.observedModel.length === 1) {
			this.observedModel.forEach((customer) => {
				this.$scope.model = {
					id: {
						label: "Customer ID",
						content: customer.customer_id,
					},
					first_name: {
						label: "First Name",
						content: customer.first_name,
					},
					last_name: {
						label: "Last Name",
						content: customer.last_name,
					},
					age: {
						label: "Birthday",
						content: new Date(customer.birthday),
					},
					gender: {
						label: "Gender",
						content: customer.gender,
					},
					last_contact: {
						label: "Last Contact",
						content: new Date(customer.last_contact),
					},
					customer_lifetime_value: {
						label: "Customer Lifetime Value",
						content: customer.customer_lifetime_value,
					}
				};
				this.$scope.heading = "Edit Customer";
			});
		}
```

Now, I repeat the same process for the case of *`no-data`*, which basically translates to the _/add_-route.

```js
		if (typeof this.$scope.model.id === "undefined") {
			let all = await this.CustomerService.fetchCustomers();
			let last = all[all.length - 1].customer_id;
			this.$scope.model = {
				id: {
					label: "Customer ID",
					content: (+last + 1).toString(),
				},
				first_name: {
					label: "First Name",
					content: "",
				},
				last_name: {
					label: "Last Name",
					content: "",
				},
				age: {
					label: "Birthday",
					content: new Date("1991-09-15"),
				},
				gender: {
					label: "Gender",
					content: "m",
				},
				last_contact: {
					label: "Last Contact",
					content: new Date("2000-01-15"),
				},
				customer_lifetime_value: {
					label: "Customer Lifetime Value",
					content: 100.50,
				}
			};
			this.$scope.heading = "Add Customer";
		}
```

Finally, I add some model specific functionality for a custom data-validation.
We can use that later in the FormsController

```js
		Object.getOwnPropertyNames(this.$scope.model).forEach((key) => {
			switch (key) {
				case "first_name":
				case "last_name":
				case "gender":
					this.$scope.model[key].validate = (function() {
						return (typeof this.content === "string" && this.content.length > 0);
					}).bind(this.$scope.model[key]);
					break;
				case "age":
				case "last_contact":
					//pretty hard to check this for being empty
					//as it always remembers the last date
					//as not required in the specs I continue
					this.$scope.model[key].validate = () => true;
					break;
				case "customer_lifetime_value":
					this.$scope.model[key].validate = (function() {
						return !isNaN(this.content);
					}).bind(this.$scope.model[key]);
					break;
				default:
					this.$scope.model[key].validate = () => true;
			}
		});
		this._digest();
	}
}
```

# A Details Companion - Navigation Data

It consists of
* [/views/navigation.pug](#Navigation-Page-View "save:")
* [app/pages/navigation.sass](#Navigation-Page-Styles "save:")
* [app/pages/navigation.js](#Navigation-Page-Ctrl "save:")

## Navigation Page View

Here again the reference image:

![customer overview](/assets/docs/navigation.png)

```pug
header.page-header.row
	.col-md-3 &nbsp;
	.col-md-6: h1#navigation-header Navigation Data for {{customer}}
	.col-md-3 &nbsp;
.row
	.col-md-3 &nbsp;
	article.panel.panel-primary.col-md-6
		navi-data(model="{{model}}").panel-body
		.panel-footer
			label.btn.btn-default(ng-click="$goToOverview()") Back To Overview
	.col-md-3 &nbsp;
```

## Navigation Page Styles

```sass
h1#navigation-header
	font-weight: bold

article.panel
	padding-left: 0
	padding-right: 0
	box-shadow: 0px 10px 25px 5px rgba(150, 150, 150, 0.5)
```

## Navigation Page Ctrl

This thing is rolling smoothly so nothing new here :)

```js
import "./navigation.sass";

import { Controller as Ctrl } from "ng-harmony-core";
import { Controller, Logging } from "ng-harmony-decorator";

import * as Config from "../../../assets/data/config.global.json";

@Controller({
	module: "webtrekk",
	name: "NavigationPageCtrl",
	deps: ["observedModel", "$location"]
})
@Logging({
	loggerName: "NavigationPageLogger",
	...Config
})
export class NavigationPageCtrl extends Ctrl {
	constructor (...args) {
		super(...args);
		this.log({
			level: "warn",
			msg: this.observedModel
		});
		this.$scope.model = [].concat(this.observedModel);
	}

	$goToOverview () {
		this.$location.url("/");
	}
}
```

# Unit Tests Setup

In order to get our unit tests running with webpack we include this little workaround
as found on github :)

[app/tests.webpack.js](#Webpack-Unit-Test-Entry-Point "save:")

## Webpack Unit Test Entry Point

```js
import "angular";
import "angular-mocks/angular-mocks";

const context = require.context("./", true, /\.spec\.js$/);

context.keys().forEach(context);
```
