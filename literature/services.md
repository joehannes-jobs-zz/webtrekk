#This is the _Customer Local Storage Service_

[app/services/customer.js](#Customer-Service "save:")

## Customer Service

* Let's create the Service using my ng-harmony-decorator lib.
* Then I add a special logger, which allows me to log conveniently,
and in theory, allows to add a remote logger via configuration (like Rollbar).
* By extending ng-harmony-core Service we get rid of additional angular cumberness.
* In the constructor I trigger the async creation of an RxDB
* plus populate it conditionally via upsert
* Moreover I provide convencience functions to fetch desired data which shall be consumed by the Components ultimately
* Finally I provide Observable-Registries in order to get auto updated on inter-component levels

```js
import { Service as Srvc } from "ng-harmony-core";
import { Service, Logging } from "ng-harmony-decorator";
import { Log } from "ng-harmony-log";

import * as CustomerSchema from "../../assets/data/json/customer.schema.json";
import * as NavigationSchema from "../../assets/data/json/navigation.schema.json";

import * as CustomerPayload from "../../assets/data/json/customer.payload.json";
import * as NavigationPayload from "../../assets/data/json/navigation.payload.json";

import * as Rx from "rxjs";
import * as RxDB from "rxdb";
import * as Adapter from "pouchdb-adapter-idb";

import Config from "../../assets/data/json/config.global.json";

@Service({
	module: "webtrekk",
	name: "CustomerService",
})
@Logging({
	loggerName: "CustomerLogger",
	...Config,
})
export class CustomerService extends Srvc {
	constructor(...args) {
		super(...args);

		this.initialized = this.$q.defer();
		this._create();
	}
	async _create () {
		RxDB.plugin(Adapter);
		this.db = await RxDB.create({
			name: "webtrekkjoehannes",             // <- name
			adapter: "idb",           // <- storage-adapter
			multiInstance: false         // <- multiInstance (default: true)
		});

		await this.db.collection({
			name: "customer",
			schema: CustomerSchema
		});
		CustomerPayload.forEach((c, i, p) => {
			this.db.customer.upsert(c);
		});

		await this.db.collection({
			name: "navigation",
			schema: NavigationSchema
		});
		NavigationPayload.forEach((c, i, p) => {
			this.db.navigation.upsert(c);
		});

		this.initialized.resolve();
	}
	fetchCustomers () {
		this.db.customer._queryCache.destroy();
		return this.db.customer
			.find()
			.exec();
	}
	customerSearch (id) {
		this.db.customer._queryCache.destroy();
		return this.db.customer
			.find()
			.where("customer_id")
			.eq(id)
			.exec();
	}
	navigationSearch (id) {
		this.db.navigation._queryCache.destroy();
		return this.db.navigation
			.find()
			.where("customer_id")
			.eq(id)
			.exec();
	}
	subscribeCustomer (observer) {
		this.db.customer.$.subscribe(observer);
	}
	subscribeNavigation (observer) {
		this.db.navigation.$.subscribe(observer);
	}
}
```
