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
