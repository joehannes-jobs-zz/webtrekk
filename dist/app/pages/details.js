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
