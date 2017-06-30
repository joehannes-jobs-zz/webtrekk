# Here I declare our little components/tables which encapsulate our main entities

### We got

* [app/components/customers/customers.js](#Customers-Table "save:")
* [app/components/customer_form/customer_form.js](#Customer-Form "save:")
* [app/components/nav_data/nav_data.js](#Navigation-Data "save:")
*
### Each of those components will have a pug-template

* [app/components/customers/customers.pug](#Customers-Table-Template "save:")
* [app/components/customer_form/customer_form.pug](#Customer-Form-Template "save:")
* [app/components/nav_data/nav_data.pug](#Navigation-Data-Template "save:")
*
### And we might want to add some styling on top of bootstrap, so let's be prepared

* [app/components/customers/customers.sass](#Customers-Table-Styles "save:")
* [app/components/customer_form/customer_form.sass](#Customer-Form-Styles "save:")
* [app/components/nav_data/nav_data.sass](#Navigation-Data-Styles "save:")

## Customers Table Template

I like to start with the visual structure, so I get a better understanding of
what's going on, a better mental picture, so to speak.

```pug
table.table.table-striped
	thead
		tr
			th
				span.glyphicon(aria-hidden="true" ng-class="{ASC:'glyphicon-sort-by-alphabet', DESC:'glyphicon-sort-by-alphabet-alt', DEFAULT:'glyphicon-sort'}[tableHeaders.first_name.sorting]")
				span {{tableHeaders.first_name.name}}
			th
				span.glyphicon(aria-hidden="true" ng-class="{ASC:'glyphicon-sort-by-alphabet', DESC:'glyphicon-sort-by-alphabet-alt', DEFAULT:'glyphicon-sort'}[tableHeaders.last_name.sorting]")
				span {{tableHeaders.last_name.name}}
			th {{tableHeaders.age.name}}
			th {{tableHeaders.gender.name}}
	tbody
		tr(ng-repeat="dataset in model | orderBy:orderByName" ng-class="{active: dataset.active}")
			td {{dataset.first_name}}
			td {{dataset.last_name}}
			td {{dataset.age}}
			td {{dataset.gender}}
```


## Customers Table

The customers table is an _bootstrap_ table and receives it's data
via input binding. It has some action buttons, that actually are _angular-ui-bootstrap_ components
and it does some sorting. There's really no big issue :)

```js
import { Logging, Controller, Component, Evented } from "ng-harmony-decorator";
import { EventedController } from "ng-harmony-controller";

import CustomersTpl from "./customers.pug";
import "./customers.sass";

import Config from "../../../../assets/data/config.global.json";


@Component({
	module: "webtrekk",
	selector: "customers",
	restrict: "E",
	replace: false,
	controller: "CustomersCtrl",
	template: CustomersTpl
})
@Controller({
	module: "webtrekk",
	name: "CustomersCtrl",
	scope: {
		model: "@"
	}
})
@Logging({
	loggerName: "CustomersLogger",
	...Config
})
export class CustomersCtrl extends EventedController {
	constructor(...args) {
		super(...args);
		this.$scope.$on("change", this.handleEvent.bind(this));

		this.$scope.orderByFirstName = 'id';
		this.$scope.orderByLastName = 'last_name';
		this._createTableHeaders();
	}

	_createTableHeaders () {
		this.$scope.tableHeaders = {
			"first_name": {
				name: "First Name",
				sorting: "DEFAULT",
			},
			"last_name": {
				name: "Last Name",
				sorting: "ASC",
			},
			"age": {
				name: "Age",
			},
			"gender": {
				name: "Gender",
			},
		};
	}

	handleEvent (ev, { scope, triggerTokens }) {
		this.log({
			level: "info",
			msg: "handlingEventBehaviourPropagation",
		});
		if (scope._name.fn === "CustomersCtrl" &&
			triggerTokens.type === "click" &&
			triggerTokens.selector === "table>tbody") {
			//TODO this._emit this.$scope.n ... careful n is sort-sensitive
			this.log({
				level: "warn",
				msg: this.$scope.model[this.$scope.n],
			});
		}
	}

	@Evented({
		selector: "table>tbody",
		type: "click",
		delegate: "table>tbody>tr",
	})
	activate () {
		this.$scope.model.forEach((dataset, nthChild) => {
			this.log({
				level: 'info',
				msg: dataset,
			});
			this.log({
				level: 'info',
				msg: this.$scope.n,
			});
			dataset.active = this.$scope.n === nthChild && !dataset.active;
		});
		this._digest();
	}

	@Evented({
		selector: "table>thead>tr>th:first-child",
		type: "click",
	})
	sortByFirstName () {
		this.sortBy("last_name", true)
		this.sortBy("first_name");
		this.$scope.orderByName = this.$scope.tableHeaders.first_name.ordering;
		this._digest();
	}

	@Evented({
		selector: "table>thead>tr>th:nth-child(2)",
		type: "click",
	})
	sortByLastName () {
		this.sortBy("first_name", true)
		this.sortBy("last_name");
		this.$scope.orderByName = this.$scope.tableHeaders.last_name.ordering;
		this._digest();
	}

	sortBy (attr, reset) {
		let sortOrders = ["DEFAULT", "ASC", "DESC"],
			orderBy = {
				first_name: ['id', 'first_name', '-first_name'],
				last_name: ['id', 'last_name', '-last_name']
			},
			order = 0;
		!reset && sortOrders.forEach((sortOrder, i) => {
			if (sortOrder === this.$scope.tableHeaders[attr].sorting) {
				order = i === 2 ? 0 : i + 1;
				return false;
			}
		});
		this.$scope.tableHeaders[attr].sorting = sortOrders[order];
		this.$scope.tableHeaders[attr].ordering = orderBy[attr][order];
	}
}
```

## Customers Table Styles

```sass
table > thead > tr > th
	&:nth-child(1):hover, &:nth-child(2):hover
		cursor: pointer
		background-color: rgba(50, 50, 200, .1)
	&:first-child
		padding-left: 15px
	&:last-child
		padding-right: 15px

table > tbody > tr > td
	&:first-child
		padding-left: 15px
	&:last-child
		padding-right: 15px
```

## Customers Form Template

I create a simple form using bootstrap and ng-model
Those are embedded in a panel for nice looks, and bottom-attached I put the actions :)

```pug
form(id="customer_details_form")
	.panel-body
		.form-group.form-inline
			label(for="id") {{form.id.label}}
			input.form-control.disabled(id="id" type="text" disabled ng-model="form.id.content")
		.form-group.form-inline
			label(for="first_name") {{form.first_name.label}}
			input.form-control(id="first-name" type="text" placeholder="John" ng-model="form.first_name.content")
		.form-group.form-inline
			label(for="last_name") {{form.last_name.label}}
			input.form-control(id="last-name" type="text" placeholder="Doe" ng-model="form.last_name.content")
		.form-group.form-inline
			label(for="birthday") {{form.birthday.label}}
			input.form-control(id="birthday" type="date" placeholder="1981-07-05" ng-model="form.birthday.content")
		.form-group.form-inline
			label(for="gender") {{form.gender.label}}
			select.form-control(name="gender" ng-model="form.gender.content" ng-options="o in ['m', 'w']")
		.form-group.form-inline
			label(for="last_contact") {{form.last_contact.label}}
			input.form-control(id="last_contact" type="date" placeholder="2000-01-01" ng-model="form.last_contact.content")
		.form-group.form-inline
			label(for="customer_lifetime_value") {{form.customer_lifetime_value.label}}
			input.form-control(id="customer_lifetime_value" type="text" placeholder="100.50" ng-model="form.customer_lifetime_value.content")
	.panel-footer
		label.btn.btn-default#save Save
		label.btn.btn-danger#cancel Cancel
```


## Customers Form

```js
import { Logging, Controller, Component, Evented } from "ng-harmony-decorator";
import { EventedController } from "ng-harmony-controller";

import CustomersFormTpl from "./customers_form.pug";
import "./customers_form.sass";

import Config from "../../../../assets/data/config.global.json";


@Component({
	module: "webtrekk",
	selector: "customers-form",
	restrict: "E",
	replace: false,
	controller: "CustomersFormCtrl",
	template: CustomersFormTpl
})
@Controller({
	module: "webtrekk",
	name: "CustomersFormCtrl",
	deps: ["$location", "CustomerService"]
})
@Logging({
	loggerName: "CustomersFormLogger",
	...Config
})
export class CustomersFormCtrl extends EventedController {
	form = {};

	constructor(...args) {
		super(...args);
		this.$scope.$on("change", this.handleEvent.bind(this));

		this.initialize();
	}

	async initialize () {
		(this.model.length === 1) && this.model.forEach((customer) => {
			this.form = {
				id: customer.customer_id,
				first_name: customer.first_name,
				last_name: customer.last_name,
				age: customer.birthday,
				gender: customer.gender,
				last_contact: customer.last_contact,
				customer_lifetime_value: customer.customer_lifetime_value,
			};
		});

		if (typeof this.form.id === "undefined") {
			let all = await this.CustomerService.fetchCustomers();
			let last = all[all.length - 1].customer_id;
			this.form = {
				id: last + 1,
				first_name: "",
				last_name: "",
				age: "1991-09-15",
				gender: "m",
				last_contact: "2000-01-15",
				customer_lifetime_value: 100.50,
			};
		}
	}

	handleEvent (ev, { scope, triggerTokens }) {
		this.log({
			level: "info",
			msg: "handlingEventBehaviourPropagation",
		});
		if (scope._name.fn === "CustomersFormCtrl" &&
			triggerTokens.type === "mouseup") {
			this.log({
				level: "warn",
				msg: "Button Clicked, Handle Behaviour Propagation?"
			});
		}
	}

	@Evented({
		selector: "label#save",
		type: "mouseup",
	})
	activate () {
		this.log({
			level: 'info',
			msg: "Save clicked";
		});
	}

	@Evented({
		selector: "label#cancel",
		type: "mouseup",
	})
	sortByFirstName () {
		this.$location.url("/");
	}
}
```

## Customers Table Styles

```sass
form
	color: black
```
