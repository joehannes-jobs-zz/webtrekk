import Module from "../../app";
import { NavigationCtrl } from "./navi_data";

import NavigationPayload from "../../../../assets/data/customer.payload.json";

describe("NavigationComponent", () => {
    describe("NaviDataCtrl", () => {
        var ctrl, $scope, $element;

        beforeEach(() => {
            angular.mock.module(Module);

            inject(($controller, $rootScope, $location) => {
                $scope = $rootScope.$new();
				$element = angular.element('<div></div>');

                ctrl = $controller("NaviDataCtrl", {
					$scope,
					$location,
					$element
				});
            });
        });

        it("should have it's proper name", () => {
            expect(ctrl.constructor.name).toBe("NaviDataCtrl");
        });

		it("should have default sorting by timestamp ASC", () => {
            expect(ctrl.$scope.tableHeaders.timestamp.sorting).toBe("ASC");
        });

		it("should increase sort order by one step to ts:DESC", () => {
			ctrl.sortByTimestamp();
			expect(ctrl.$scope.tableHeaders.timestamp.sorting).toBe("DESC");
        });

		it("should also be reflected in the templates ordering binding prop", () => {
			ctrl.sortByTimestamp();
			expect(ctrl.$scope.tableHeaders.timestamp.ordering).toBe('-timestamp');
		});

		it("should also increase sort order by for page to page:ASC", () => {
			ctrl.sortByPage();
			expect(ctrl.$scope.tableHeaders.page.sorting).toBe("ASC");
        });

		it("should also reset ts sorting to DEFAULT on sorting byElse", () => {
			ctrl.sortByPage();
			expect(ctrl.$scope.tableHeaders.timestamp.sorting).toBe("DEFAULT");
        });
    });
});
