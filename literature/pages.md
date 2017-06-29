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
h1#overview-header Customer Overview
button(button) Add New Customer
customers(model="{{model}}")
```

## Overview PageStyles

```sass
h1#overview-header
	color: red
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
	deps: ["CustomerService"]
})
@Logging({
	loggerName: "CustomersLogger",
	...Config
})
export class OverviewPageCtrl extends Ctrl {
	constructor (...args) {
		super(...args);

		//I think there's no use case for this as there's no real backend
        //this.CustomerService.subscribeCustomer(this.onCustomerChange.bind(this));
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
h1#details-header Customer Details
form
	label Field
	input
	button.button Save
	button.button Cancel
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
})
export class DetailsPageCtrl extends Ctrl {}
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
