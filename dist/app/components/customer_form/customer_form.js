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
	deps: ["$location", "$rootScope", "CustomerService"],
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
	async saveAndReturn () {
		let valid = Object.getOwnPropertyNames(this.$scope.model)
			.map((tupel) => {
				let valid = this.$scope.model[tupel].validate();
				if (!valid) {
					this.log({
						level: "error",
						msg: `${this.$scope.model[tupel].label} cannot be ${this.$scope.model[tupel].content} -- invalid`,
					});
				}
				this.$scope.model[tupel].valid = valid;
				return valid;
			}).reduce((acc, tupel) => acc && tupel);
		if (valid) {
			await this.CustomerService.upsertCustomer({
				customer_id: this.$scope.model.id.content,
				first_name: this.$scope.model.first_name.content,
				last_name: this.$scope.model.last_name.content,
				birthday: this.$scope.model.age.content.toString(),
				gender: this.$scope.model.gender.content,
				last_contact: this.$scope.model.last_contact.content.toString(),
				customer_lifetime_value: this.$scope.model.customer_lifetime_value.content,
			});
			this.$location.url("/");
			this.$rootScope.$apply();
		}
		this._digest();
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
