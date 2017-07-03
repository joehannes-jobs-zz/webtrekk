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
