# Here I declare our little components/tables which encapsulate our main entities

### We got

* [app/components/customers/customers.js](#Customers-Table "save:")
* [app/components/customer_form/customer_form.js](#Customer-Form "save:")
<!--* [app/components/nav_data/nav_data.js](#Navigation-Data "save:")-->
*
### Each of those components will have a pug-template

* [app/components/customers/customers.pug](#Customers-Table-Template "save:")
* [app/components/customer_form/customer_form.pug](#Customer-Form-Template "save:")
<!--* [app/components/nav_data/nav_data.pug](#Navigation-Data-Template "save:")-->

### And we might want to add some styling on top of bootstrap, so let's be prepared

* [app/components/customers/customers.sass](#Customers-Table-Styles "save:")
* [app/components/customer_form/customer_form.sass](#Customer-Form-Styles "save:")
<!--* [app/components/nav_data/nav_data.sass](#Navigation-Data-Styles "save:")-->

## Customers Table Template

I like to start with the visual structure, so I get a better understanding of
what's going on, a better mental picture, so to speak.

```pug
table.table.table-striped.table-hover
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
		tr(ng-repeat="dataset in model | orderBy:orderByName" ng-class="{danger: dataset.active}" data-index="{{dataset.id}}")
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
		this.$scope.orderByName = 'last_name';

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

	handleEvent (ev, opts) {
		this.log({
			level: "info",
			msg: "handlingEventBehaviourPropagation",
		});
		if (opts.scope._name.fn === "CustomersCtrl" &&
			opts.triggerFn === "activate") {
			opts.data = this.$scope.model.filter((ds) => ds.active)[0];
		}
	}

	@Evented({
		selector: "tbody",
		type: "click",
		delegate: "tbody>tr",
	})
	activate (el, ev) {
		let _el = ev.currentTarget,
			$id = _el.getAttribute("data-index");
		this.$scope.model.forEach((dataset) => {
			dataset.active = dataset.id == $id && !dataset.active;
		});
		this.log({
			level: 'info',
			msg: $id,
		});
		this._digest();
	}

	@Evented({
		selector: "thead>tr>th:first-child",
		type: "click",
	})
	sortByFirstName () {
		this.sortBy("last_name", true)
		this.sortBy("first_name");
		this.$scope.orderByName = this.$scope.tableHeaders.first_name.ordering;
		this._digest();
	}

	@Evented({
		selector: "thead>tr>th:nth-child(2)",
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

table > tbody > tr
	cursor: pointer
	td
		&:first-child
			padding-left: 15px
		&:last-child
			padding-right: 15px
```

## Customer Form Template

I create a simple form using bootstrap and ng-model
Those are embedded in a panel for nice looks, and bottom-attached I put the actions :)

```pug
form(id="customer_details_form")
	.panel-body.container-fluid
		.form-group.form-inline.row
			label(for="id").col-md-5.text-right {{model.id.label}}
			input.form-control.disabled.col-md-7(id="id" type="text" disabled ng-model="model.id.content")
		.form-group.form-inline.row
			label(for="first_name").col-md-5.text-right {{model.first_name.label}}
			input.form-control.col-md-7(id="first-name" type="text" placeholder="John" ng-model="model.first_name.content")
		.form-group.form-inline.row
			label(for="last_name").col-md-5.text-right {{model.last_name.label}}
			input.form-control.col-md-7(id="last-name" type="text" placeholder="Doe" ng-model="model.last_name.content")
		.form-group.form-inline.row
			label(for="birthday").col-md-5.text-right {{model.age.label}}
			input.form-control.col-md-7(id="birthday" type="date" placeholder="1981-07-05" ng-model="model.age.content")
		.form-group.form-inline.row
			label(for="gender").col-md-5.text-right {{model.gender.label}}
			select.form-control.col-md-7(name="gender" ng-model="model.gender.content" ng-options="o for o in ['m', 'w']")
		.form-group.form-inline.row
			label(for="last_contact").col-md-5.text-right {{model.last_contact.label}}
			input.form-control.col-md-7(id="last_contact" type="date" placeholder="2000-01-01" ng-model="model.last_contact.content")
		.form-group.form-inline.row
			label(for="customer_lifetime_value").col-md-5.text-right {{model.customer_lifetime_value.label}}
			input.form-control.col-md-7(id="customer_lifetime_value" type="text" placeholder="100.50" ng-model="model.customer_lifetime_value.content")
	.panel-footer
		label.btn.btn-success#save Save
		span.spacer-10 &nbsp;
		label.btn.btn-danger#cancel Cancel
```


## Customer Form

```js
import { Logging, Controller, Component, Evented } from "ng-harmony-decorator";
import { EventedController } from "ng-harmony-controller";

import CustomersFormTpl from "./customer_form.pug";
import "./customer_form.sass";

import Config from "../../../../assets/data/config.global.json";


@Component({
	module: "webtrekk",
	selector: "customerForm",
	restrict: "E",
	replace: true,
	controller: "CustomersFormCtrl",
	template: CustomersFormTpl
})
@Controller({
	module: "webtrekk",
	name: "CustomersFormCtrl",
	deps: ["$location", "$rootScope"],
	scope: {
		model: "@"
	}
})
@Logging({
	loggerName: "CustomersFormLogger",
	...Config
})
export class CustomersFormCtrl extends EventedController {
	constructor(...args) {
		super(...args);
		this.$scope.$on("change", this.handleEvent.bind(this));
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
	saveAndReturn () {
		this.log({
			level: 'info',
			msg: "Save clicked",
		});
	}

	@Evented({
		selector: "label#cancel",
		type: "mouseup",
	})
	cancelByReturn () {
		this.$location.path("/");
		this.$rootScope.$apply();
	}
}
```

## Customer Form Styles

```sass
form#customer_details_form
	padding-left: 0
	padding-right: 0

label
	line-height: 2.5em
```
