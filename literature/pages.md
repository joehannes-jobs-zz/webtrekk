# Chapter pages

Pages are root components with all their assets (styling, templates).
They correlate to routes in a 1:1 manner

### Let's revise

Given the [specs](/README.md) we can conclude we got 3 views:
* The landing page is the _customer overview_
* One can navigate to the _details_, which is a separate page
* As to not leave the _details_ such a lonely Asset, there comes the _navigation data_ to the rescue

Let's kick off with the _Landing Page_, which is the customer overview.

# Landing Page aka Customer Overview

It consists of
* [/build/views/overview.pug](#Overview-View "save:")
* [/build/app/pages/overview.sass](#Overview-PageStyles "save:")
* [/build/app/pagees/overview.js](#Overview-PageCtrl "save:")

## Overview View

Here again the reference image:

![customer overview](/assets/docs/overview.png)

Pretty Simple :)

```pug
	h1#overview-header: Customer Overview
	button(button): Add New Customer
	table
```

## Overview PageStyles

```sass
	h1#overview-header
		font-color: red
```

## Overview PageCtrl

Let's get the party started!

```js
import "./overview.sass";

import { Controller as Ctrl } from "ng-harmony-core";
import { Controller } from "ng-harmony-decorator";

@Controller({
	module: "webtrekk",
	name: "OverviewPageCtrl"
})
export class OverviewPageCtrl extends Ctrl {};
```

# Time to add some detail

It consists of
* [/build/views/details.pug](#Details-View "save:")
* [/build/app/pages/details.sass](#Details-PageStyles "save:")
* [/build/app/pagees/details.js](#Details-PageCtrl "save:")

## Details View

Here again the reference image:

![customer overview](/assets/docs/details.png)

Pretty Simple :)

```pug
	h1#details-header Customer Details
	form
		label: Field
		input: Value
		button(button): Save
		button(button): Cancel
```

## Details PageStyles

```sass
	h1#details-header
		font-color: blue
```

## Details PageCtrl

Same thing here :)

```js
import "./details.sass";

import { Controller as Ctrl } from "ng-harmony-core";
import { Controller } from "ng-harmony-decorator";

@Controller({
	module: "webtrekk",
	name: "DetailsPageCtrl"
})
export class DetailsPageCtrl extends Ctrl {};
```

# A Details Companion - Navigation Data

It consists of
* [/build/views/navigation.pug](#Navigation-View "save:")
* [/build/app/pages/navigation.sass](#Navigation-PageStyles "save:")
* [/build/app/pagees/navigation.js](#Navigation-PageCtrl "save:")

## Navigation View

Here again the reference image:

![customer overview](/assets/docs/navigation.png)

```pug
	h1#navigation-header Navigation Data for {user.name}
	table
		tr
			th: Page
			th: Timestamp
		tr
			td: X
			td: 2013-07-07
```

## Navigation PageStyles

```sass
	h1#navigation-header
		font-color: green
```

## Navigation PageCtrl

Same thing here :)

```js
import "./navigation.sass";

import { Controller as Ctrl } from "ng-harmony-core";
import { Controller } from "ng-harmony-decorator";

@Controller({
	module: "webtrekk",
	name: "NavigationPageCtrl"
})
export class NavigationPageCtrl extends Ctrl {};
```
