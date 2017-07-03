import "./navigation.sass";

import { Controller as Ctrl } from "ng-harmony-core";
import { Controller, Logging } from "ng-harmony-decorator";

import * as Config from "../../../assets/data/config.global.json";

@Controller({
	module: "webtrekk",
	name: "NavigationPageCtrl",
	deps: ["observedModel", "$location"]
})
@Logging({
	loggerName: "NavigationPageLogger",
	...Config
})
export class NavigationPageCtrl extends Ctrl {
	constructor (...args) {
		super(...args);
		this.log({
			level: "warn",
			msg: this.observedModel
		});
		this.$scope.model = [].concat(this.observedModel);
	}

	$goToOverview () {
		this.$location.url("/");
	}
}
