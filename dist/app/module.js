import "angular";
import "angular-route";
import "angular-animate";
import { Module } from "ng-harmony-module";

//TODO import bootstrap components here!

let deps = [
	'ngRoute',
	'ngAnimate',
];
var module = new Module('webtrekk', deps);

export default module;
