(function(window) {
  "use strict";
  var FORM_SELECTOR = "[data-coffee-order=\"form\"]";
  var CHECKLIST_SELECTOR = "[data-coffee-order=\"checklist\"]";
  //var SERVER_URL = "http://coffeerun-v2-rest-api.herokuapp.com/api/coffeeorders";
  var SERVER_URL = "http://localhost:2403/coffeeorders";
  var App = window.App;
  var Truck = App.Truck;
  //var DataStore = App.DataStore;
  var RemoteDataStore = App.RemoteDataStore;
  var FormHandler = App.FormHandler;
  var Validation = App.Validation;
  var CheckList = App.CheckList;
  var $ = window.jQuery;

  var remoteDS = new RemoteDataStore(SERVER_URL);
  // DataStore can be used if we do not want to use local storage
  //var myTruck = new Truck("ncc-1701", new DataStore());

  // This way we can persist the data using the remote service
  var myTruck = new Truck("ncc-1701", remoteDS);

  window.myTruck = myTruck;

  var checkList = new CheckList(CHECKLIST_SELECTOR);
  checkList.addClickHandler(myTruck.deliverOrder.bind(myTruck));

  var formHandler = new FormHandler(FORM_SELECTOR);

  $(FORM_SELECTOR).ready(function() {
    console.log("Page refreshed");
    myTruck.displayOrders.call(myTruck, function(serverResponse) {
      $.each(serverResponse, function(i, coffeeOrder) {
        checkList.addRow.call(checkList, coffeeOrder);
      });
    });
  });

  formHandler.addSubmitHandler(function(data) {
    myTruck.createOrder.call(myTruck, data);
    checkList.addRow.call(checkList, data);
  });
  //formHandler.addSubmitHandler(myTruck.createOrder.bind(myTruck));

  formHandler.addInputHandler(Validation.isCompanyEmail);

  console.log(formHandler);
})(window);
