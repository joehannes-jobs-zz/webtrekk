import Module from "../../app";
import { CustomersCtrl } from "./customers";

import CustomerPayload from "../../../../assets/data/customer.payload.json";

describe("CustomersComponent", () => {
    describe("CustomersCtrl", () => {
        var ctrl, $scope, $element;

        beforeEach(() => {
            angular.mock.module(Module);

            inject(($controller, $rootScope, $location) => {
                $scope = $rootScope.$new();
				$element = angular.element('<div></div>');

                ctrl = $controller("CustomersCtrl", {
					$scope,
					$location,
					$element
				});
            });
        });

        it("should have it's proper name", () => {
            expect(ctrl.constructor.name).toBe("CustomersCtrl");
        });

		it("should have default sorting by last_name ASC", () => {
            expect(ctrl.$scope.tableHeaders.last_name.sorting).toBe("ASC");
        });

		it("should increase sort order by one step to last:DESC", () => {
			ctrl.sortByLastName();
			expect(ctrl.$scope.tableHeaders.last_name.sorting).toBe("DESC");
        });

		it("should also be reflected in the templates ordering binding prop", () => {
			ctrl.sortByLastName();
			expect(ctrl.$scope.tableHeaders.last_name.ordering).toBe('-last_name');
		});

		it("should also increase sort order by for firstName to first:ASC", () => {
			ctrl.sortByFirstName();
			expect(ctrl.$scope.tableHeaders.first_name.sorting).toBe("ASC");
        });

		it("should also reset lastName sorting to DEFAULT on sorting byElse", () => {
			ctrl.sortByFirstName();
			expect(ctrl.$scope.tableHeaders.last_name.sorting).toBe("DEFAULT");
        });
    });
});
