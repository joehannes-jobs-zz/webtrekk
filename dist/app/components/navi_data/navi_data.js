import { Logging, Controller, Component, Evented } from "ng-harmony-decorator";
import { EventedController } from "ng-harmony-controller";

import CustomersTpl from "./navi_data.pug";
import "./navi_data.sass";

import Config from "../../../../assets/data/config.global.json";


@Component({
	module: "webtrekk",
	selector: "naviData",
	restrict: "E",
	replace: false,
	controller: "NaviDataCtrl",
	template: CustomersTpl
})
@Controller({
	module: "webtrekk",
	name: "NaviDataCtrl",
	scope: {
		model: "@"
	}
})
@Logging({
	loggerName: "NaviDataLogger",
	...Config
})
export class NaviDataCtrl extends EventedController {
	constructor(...args) {
		super(...args);

		this.$scope.orderByPage = 'id';
		this.$scope.orderByTimestamp = 'timestamp';
		this.$scope.orderByActiveHeader = 'timestamp';

		this._createTableHeaders();
	}

	_createTableHeaders () {
		this.$scope.tableHeaders = {
			"page": {
				name: "Page",
				sorting: "DEFAULT",
			},
			"timestamp": {
				name: "Timestamp",
				sorting: "ASC",
			},
		};
	}

	@Evented({
		selector: "thead>tr>th:first-child",
		type: "click",
	})
	sortByPage () {
		this.sortBy("timestamp", true)
		this.sortBy("page");
		this.$scope.orderByActiveHeader = this.$scope.tableHeaders.page.ordering;
		this._digest();
	}

	@Evented({
		selector: "thead>tr>th:nth-child(2)",
		type: "click",
	})
	sortByTimestamp () {
		this.sortBy("page", true)
		this.sortBy("timestamp");
		this.$scope.orderByActiveHeader = this.$scope.tableHeaders.timestamp.ordering;
		this._digest();
	}

	sortBy (attr, reset) {
		let sortOrders = ["DEFAULT", "ASC", "DESC"],
			orderBy = {
				page: ['id', 'pages', '-pages'],
				timestamp: ['id', 'timestamp', '-timestamp']
			},
			order = 0;
		!reset && sortOrders.every((sortOrder, i) => {
			if (sortOrder === this.$scope.tableHeaders[attr].sorting) {
				order = i === 2 ? 0 : i + 1;
				return false;
			}
			return true;
		});
		this.$scope.tableHeaders[attr].sorting = sortOrders[order];
		this.$scope.tableHeaders[attr].ordering = orderBy[attr][order];
	}
}
