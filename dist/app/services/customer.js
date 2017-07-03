import { Service as Srvc } from "ng-harmony-core";
import { Service, Logging } from "ng-harmony-decorator";
import "ng-harmony-log";

import * as CustomerSchema from "../../../assets/data/customer.schema.json";
import * as NavigationSchema from "../../../assets/data/navigation.schema.json";

import * as CustomerPayload from "../../../assets/data/customer.payload.json";
import * as NavigationPayload from "../../../assets/data/navigation.payload.json";

import Config from "../../../assets/data/config.global.json";

import * as RxDB from "rxdb";
import * as Adapter from "pouchdb-adapter-idb";

@Service({
	module: "webtrekk",
	name: "CustomerService",
	deps: ["$q"],
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
			name: "webtrekk",
			adapter: "idb", // <- storage-adapter
			multiInstance: false, // <- multiInstance (default: true)
		});
		await this.db.collection({
			name: "customer",
			schema: CustomerSchema,
		});

		CustomerPayload.data.forEach((c) => {
			this.upsertCustomer(c);
		});

		await this.db.collection({
			name: "navigation",
			schema: NavigationSchema,
		});
		let oldDocs = await this.fetchNaviData();
		NavigationPayload.data.forEach((n) => {
			let dupe = oldDocs.some((o) => {
				return (o.customer_id === n.customer_id &&
					o.pages === n.pages &&
					o.timestamp === n.timestamp);
			});
			!dupe && this.db.navigation.insert(n);
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
			.eq(id.toString())
			.exec();
	}
	async upsertCustomer (c) {
		return await this.db.customer.upsert(c);
	}
	async deleteCustomer (id) {
		let doc = await this.customerSearch(id.toString());
		return doc[0].remove();
	}
	fetchNaviData() {
		this.db.navigation._queryCache.destroy();
		return this.db.navigation
			.find()
			.exec();
	}
	naviDataSearch (id) {
		this.db.navigation._queryCache.destroy();
		return this.db.navigation
			.find()
			.where("customer_id")
			.eq(id.toString())
			.exec();
	}
	subscribeCustomer (observer) {
		this.db.customer.$.subscribe(observer);
	}
	subscribeNavigation (observer) {
		this.db.navigation.$.subscribe(observer);
	}
}
