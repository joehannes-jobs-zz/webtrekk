import OverviewPageTpl from "../views/overview.pug";
import DetailsPageTpl from "../views/details.pug";
import NavigationPageTpl from "../views/navigation.pug";

const routes = {
	default: {
		controller: "OverviewPageCtrl",
		template: OverviewPageTpl,
		resolve: {
			observables: ["CustomerService", (CustomerService) => {
				return CustomerService.initialized.promise;
			}],
		},
	},
	"/add": {
		controller: "DetailsPageCtrl",
		template: DetailsPageTpl,
		resolve: {
			observables: ["CustomerService", (CustomerService) => {
				return CustomerService.initialized.promise;
			}],
			observedModel: () => true
		},
	},
	"/detail/:id": {
		controller: "DetailsPageCtrl",
		template: DetailsPageTpl,
		resolve: {
			observedModel: ["$route", "CustomerService", async ($route, CustomerService) => {
				await CustomerService.initialized.promise;
				return CustomerService.customerSearch($route.current.params.id);
			}],
		},
	},
	"/navigation/:id": {
		controller: "NavigationPageCtrl",
		template: NavigationPageTpl,
		resolve: {
			observedModel: ["$route", "CustomerService", async ($route, CustomerService) => {
				await CustomerService.initialized.promise;
				return CustomerService.naviDataSearch($route.current.params.id);
			}],
		},
	}
};

export default routes;
