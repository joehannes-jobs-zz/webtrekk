# Chapter pages

Pages are root components with all their assets (styling, templates).
They correlate to routes in a 1:1 manner

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

	transformBirthday (time) {
		return Math.floor((new Date().getTime() - new Date(time).getTime()) / 1000 / 3600 / 24 / 365.25);
	}

	$selection () {
		return this.$scope.model.filter((ds) => ds.active).length === 0;
	}
	_getActiveId () {
		return this.$scope.model.reduce((a, b) => {
			return b.active ? a + +b.id : a;
		}, 0);
	}
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
	.col-md-6: h1#overview-header {{heading}}
	.col-md-3 &nbsp;
.row
	.col-md-3 &nbsp;
	customer-form(model="{{model}}").panel.panel-primary.col-md-6
	.col-md-3 &nbsp;
```

## Details PageStyles

```sass
h1#details-header
	color: blue
```

## Details PageCtrl

Same thing here :)

```js
import "./details.sass";

import { Controller as Ctrl } from "ng-harmony-core";
import { Controller, Logging } from "ng-harmony-decorator";

import * as Config from "../../../assets/data/config.global.json";

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

	async initialize () {
		this.log({
			level: "info",
			msg: this.$scope
		});
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

Let's get the party started!

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
