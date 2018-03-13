(function(window) {
  "use strict";
  var App = window.App || {};
  var $ = window.jQuery;

  function RemoteDataStore(url) {
    if (!url) {
      throw new Error("URL not provided");
    }

    this.serverUrl = url;
  }

  RemoteDataStore.prototype.add = function(key, val) {
    this.remove(key);
    $.post(this.serverUrl, val, function(serverResponse) {
      console.log(serverResponse);
    });
  };

  RemoteDataStore.prototype.getAll = function(cb) {
    $.get(this.serverUrl, function(serverResponse) {
      console.log("From getAll function : " + serverResponse);
      cb(serverResponse);
    });
  };

  /*RemoteDataStore.prototype.get = function(key,cb){
    $.get(this.serverUrl + "/" + key ,function(serverResponse){
      console.log(serverResponse);
      cb(serverResponse);
    });
  };*/

  RemoteDataStore.prototype.get = function(key, cb) {
    $.get(this.serverUrl + "?emailAddress=" + key, function(serverResponse) {
      console.log(serverResponse);
      cb(serverResponse);
    });
  };

  RemoteDataStore.prototype.remove = function(key) {
    var serverUrl = this.serverUrl;
    this.get(key, function(serverResponse) {

      if (serverResponse.length != 0) {
        console.log("server resposne is :" + serverResponse)
        var id = getId(key, serverResponse[0]["id"]);

        $.ajax(serverUrl + "/" + id, {
          type: "DELETE"
        });
      }

    });
  };

  function getId(key, id) {
    console.log("The id to remove is :" + id);
    return id;
  }

  /*RemoteDataStore.prototype.remove = function(key){
    $.ajax(this.serverUrl + "?emailAddress=" + key ,{
      type: "DELETE"
    });
  };*/

  App.RemoteDataStore = RemoteDataStore;
  window.App = App;
})(window);
