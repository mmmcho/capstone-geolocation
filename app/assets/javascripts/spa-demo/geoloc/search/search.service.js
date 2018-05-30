(function() {
  "use strict";

  angular
    .module("spa-demo.geoloc")
    .service("spa-demo.geoloc.search", Search);

  Search.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];

  function Search($resource, APP_CONFIG) {
    var items = $resource(APP_CONFIG.server_url + "/api/items");

    var service = this;
    service.getItems=getItems;

    return;
    ////////////////

    //returns location information for a provided address
    function getItems(lat, lng, miles, imagelist) {
      console.log("search service", imagelist);
      var distance="false";
      if (miles) {
        distance="true";
      }
      return items.query({lat: lat, lng: lng, miles: miles, imagelist:imagelist, distance:distance, order:"asc"});
    }
  }
})();
