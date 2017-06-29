# Here I declare our little components/tables which encapsulate our main entities

### We got

* [app/components/customers/customers.js](#Customers-Table "save:")
<!--
* [app/components/customer_form/customer_form.js](#Customer-Form "save:")
* [app/components/nav_data/nav_data.js](#Navigation-Data "save:")
-->
### Each of those components will have a pug-template

* [app/components/customers/customers.pug](#Customers-Table-Template "save:")
<!--
* [app/components/customer_form/customer_form.pug](#Customer-Form-Template "save:")
* [app/components/nav_data/nav_data.pug](#Navigation-Data-Template "save:")
-->
### And we might want to add some styling on top of bootstrap, so let's be prepared

* [app/components/customers/customers.sass](#Customers-Table-Styles "save:")
<!--
* [app/components/customer_form/customer_form.sass](#Customer-Form-Styles "save:")
* [app/components/nav_data/nav_data.sass](#Navigation-Data-Styles "save:")
-->

## Customers Table template

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
		delegate: "tr",
	})
	activate () {
		this.$scope.model.forEach((dataset, nthChild) => {
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
table
	box-shadow: 0px 10px 25px 5px rgba 150, 150, 150, 0.5

table > thead > tr > th
	&:nth-child(1), &:nth-child(2)
		cursor: pointer
```
