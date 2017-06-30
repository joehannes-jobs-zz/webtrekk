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
					label.btn.btn-default(ng-disabled="$selection()") Edit
					label.btn.btn-danger(ng-disabled="$selection()") Delete
				span.spacer-10 &nbsp;
				label.btn.btn-default(ng-disabled="$selection()") Navi
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

		this.$scope.$on("change", this.handleEvent.bind(this));

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
	$selection () {
		return this.$scope.model.filter((ds) => ds.active ).length === 0;
	}
	handleEvent (ev, opts) {
		this.log({
			level: 'warn',
			msg: opts
		});
	}

	transformBirthday (time) {
		return Math.floor((new Date().getTime() - new Date(time).getTime()) / 1000 / 3600 / 24 / 365.25);
	}

	$goToAddCustomer () {
		this.$location.path("/add");
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
import { Controller } from "ng-harmony-decorator";

@Controller({
	module: "webtrekk",
	name: "DetailsPageCtrl",
	deps: ["CustomerService"],
})
export class DetailsPageCtrl extends Ctrl {
	constructor (...args) {
		super(...args);

		this.$scope.model = {};
		this.initialize();
	}

	async initialize () {
		if (this.$scope.$resolve && this.$scope.$resolve.model.length === 1) {
			this.$scope.$resolve.model.forEach((customer) => {
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
					content: last + 1,
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
		this._digest();
	}
}
```

# A Details Companion - Navigation Data

It consists of
* [/views/navigation.pug](#Navigation-View "save:")
* [app/pages/navigation.sass](#Navigation-PageStyles "save:")
* [app/pages/navigation.js](#Navigation-PageCtrl "save:")

## Navigation View

Here again the reference image:

![customer overview](/assets/docs/navigation.png)

```pug
h1#navigation-header Navigation Data for {user.name}
table
	tr
		th Page
		th Timestamp
	tr
		td X
		td 2013-07-07
```

## Navigation PageStyles

```sass
h1#navigation-header
	color: green
```

## Navigation PageCtrl

Same thing here :)

```js
import "./navigation.sass";

import { Controller as Ctrl } from "ng-harmony-core";
import { Controller } from "ng-harmony-decorator";

@Controller({
	module: "webtrekk",
	name: "NavigationPageCtrl",
})
export class NavigationPageCtrl extends Ctrl {}
```
