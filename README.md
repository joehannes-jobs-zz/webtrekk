# Webtrekk AngularJS Demo by Joehannes

## An AngularJS/LocalStorage/Bootstrap Demo

Create a Single Page Application to edit user data based on local storage (no backend).

### General requirements:

* Implemented in JavaScript using Angular.js, HTML/CSS (Bootstrap), with JavaScript tests implemented using Jasmine
* Runs in the latest version of Chrome, Firefox and Internet Explorer
* Contains documentation (in the code)
* Contatains at least one test for every controller

### Specification:

* The application starts with an Overview page listing all customers
* It contains a „Customer Detail View" to create a customer and edit his profile data.
* It contains a „Navigation Data View" that shows tracking data of the customer.
* The data is stored in local storage
* Initially (if the local storage is empty), it shall be initialised with the data from Appendix 1 "Master Data Table" and "Navigation Data Table"

## Screens

### Overview (Initial Screen)

* Sort by "First Name" or "Last Name" by clicking on the column heading (first click: ascending,second click: descending)
* Initially sorted by "Last Name", ascending
* Optionally show the sort direction in the table heading
* "Age" is calculated from the birth date
* "Add New Customer" button goes to the "Add New Customer" view
* "Edit" goes to the "Customer Detail" view
* "Delete" deletes the customer (without asking)
* "Navi" goes to the "Navigation Data" view

![customer overview](/docs/overview.png)

### Customer Details View

* Customer ID is not editable
* "Save" saves the data, "Cancel" does not save anything, both go back to the Overview

![customer details](/docs/details.png)

### Navigation Data View

* Sort by page name or timestamp by clicking on the column heading (first click: ascending, second click: descending)
* Initially sort by "Timestamp", ascending
* Optionally show the sort direction in the table heading

![navigation data](/docs/navigation.png)

### Appendix

* Initial Customer Data Load

```json

	[{
		"customer_id": 1,
		"first_name": "Peter",
		"last_name": "Smith",
		"birthday": "1996-10-12",
		"gender": "m",
		"last_contact": "2013-06-01",
		"customer_lifetime_value": 191.12
	},{
		"customer_id": 2,
		"first_name": "Anna",
		"last_name": "Hopp",
		"birthday": "1987-05-03",
		"gender": "w",
		"last_contact": "2013-07-08",
		"customer_lifetime_value": 50.99
	},{
		"customer_id": 3,
		"first_name": "Christian",
		"last_name": "Cox",
		"birthday": "1991-02-21",
		"gender": "m",
		"last_contact": "2013-08-01",
		"customer_lifetime_value": 0
	},{
		"customer_id": 4,
		"first_name": "Roxy",
		"last_name": "Fox",
		"birthday": "1979-06-30",
		"gender": "w",
		"last_contact": "2012-01-29",
		"customer_lifetime_value": 213.12
	},{
		"customer_id": 5,
		"first_name": "Eric",
		"last_name": "Adam",
		"birthday": "1969-11-21",
		"gender": "m",
		"last_contact": "2013-03-18",
		"customer_lifetime_value": 1019.91
	}]

```

* Navigation Data Table

```json

	[{
		"customer_id": 1,
		"pages": "A",
		"timestamp": "2013-­06-01 10:10:12"
	},{
		"customer_id": 1,
		"pages": "B",
		"timestamp": "2013-06-01 10:11:12"
	},{
		"customer_id": 1,
		"pages": "A",
		"timestamp": "2013-06-01 10:12:12"
	},{
		"customer_id": 2,
		"pages": "C",
		"timestamp": "2013-07-08 09:03:09"
	},{
		"customer_id": 2,
		"pages": "A",
		"timestamp": "2013-07-08 09:09:09"
	},{
		"customer_id": 2,
		"pages": "D",
		"timestamp": "2013-07-08 09:19:09"
	},{
		"customer_id": 3,
		"pages": "B",
		"timestamp": "2013-07-08 09:19:09"
	},{
		"customer_id": 3,
		"pages": "A",
		"timestamp": "2013-07-08 09:19:10"
	},{
		"customer_id": 4,
		"pages": "D",
		"timestamp": "2013-07-08 09:19:11"
	},{
		"customer_id": 4,
		"pages": "A",
		"timestamp": "2013-07-08 09:19:12"
	},{
		"customer_id": 5,
		"pages": "X",
		"timestamp": "2013-07-08 09:19:13"
	},{
		"customer_id": 5,
		"pages": "A",
		"timestamp": "2013-07-08 09:19:14"
	},{
		"customer_id": 5,
		"pages": "B",
		"timestamp": "2013-07-08 09:19:15"
	}]

```
