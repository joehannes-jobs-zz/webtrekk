import Module from "../app";
import { OverviewPageCtrl } from "./overview";

import CustomerPayload from "../../../assets/data/customer.payload.json";

describe("OverviewPage", () => {
    describe("OverviewPageCtrl", () => {
        var ctrl, $scope;

        beforeEach(() => {
            angular.mock.module(Module);
			angular.mock.module(($provide) => {
				$provide.service("CustomerService", class CustomerServiceMock {
					async fetchCustomers () {
						return CustomerPayload.data;
					}
				});
			});

            inject(($controller, $rootScope, $location, CustomerService) => {
                $scope = $rootScope.$new();
                ctrl = $controller("OverviewPageCtrl", {
					$scope,
					$location,
					CustomerService
				});
            });
        });

        it("should have it's proper name", () => {
            expect(ctrl.constructor.name).toBe("OverviewPageCtrl");
        });

		it("should transform birthdays to age", () => {
            let age = ctrl.transformBirthday(CustomerPayload.data[0].birthday);
            expect(age > 0 && age < 121).toBeTruthy();
        });

		it("should recognize no dataset is active since none is loaded", () => {
            expect(ctrl._getActiveId()).toEqual(0);
        });
    });
});
