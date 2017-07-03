import "../../assets/styles/main.sass";

import module from "./module";
import routes from "./routes";

import "./pages/overview";

import "./pages/details";
import "./pages/details.sass";

import "./pages/navigation";
import "./pages/navigation.sass";

import "./services/customer";

import "./components/customers/customers";
import "./components/customer_form/customer_form";
import "./components/navi_data/navi_data";

module.routing(routes);
module.config(($locationProvider) => {
	$locationProvider.html5Mode(false);
});
module.bootstrap();

export default module.name;
