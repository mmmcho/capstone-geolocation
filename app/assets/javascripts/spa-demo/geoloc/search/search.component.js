(function() {
  "use strict";

  angular
    .module("spa-demo.geoloc")
    .component("sdSearch", {
      templateUrl: templateUrl,
      controller: SearchController,
      //bindings: {},
    });


  templateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.search_html;
  }

  SearchController.$inject = ["$scope", 'filterFilter',
                                             "spa-demo.geoloc.geocoder",
                                             "spa-demo.geoloc.currentOrigin",
                                             "spa-demo.geoloc.myLocation",
                                             "spa-demo.geoloc.search"];
  function SearchController($scope, filterFilter, geocoder, currentOrigin, myLocation, search) {
    var vm=this;
    vm.lookupAddress=lookupAddress;
    vm.getOriginAddress=getOriginAddress;
    vm.clearOrigin=clearOrigin;
    vm.isCurrentLocationSupported = myLocation.isCurrentLocationSupported;
    vm.useCurrentLocation=useCurrentLocation;
    vm.myPositionError=null;
    vm.changeDistance=changeDistance;
    vm.getItems=getItems;
    vm.getPosition=getPosition;
    vm.selectedImages=selectedImages;
    vm.selectedList=null;
    vm.clearCheckboxes=clearCheckboxes;
    vm.$onInit = function() {
      console.log("SearchController",$scope);
    }
    return;
    //////////////
    function lookupAddress() {
      console.log("lookupAddress for", vm.address);
      geocoder.getLocationByAddress(vm.address).$promise.then(
        function(location){
          currentOrigin.setLocation(location);
          console.log("location", location);
        });
    }
    function selectedImages() {
      vm.imagelist=[];
      angular.forEach(vm.selectedList, function(value, key) {
        if (value) {
          vm.imagelist.push(key);
        }
      });
      console.log("selectedImages:", vm.imagelist)
      return vm.imagelist;
    }
    function clearCheckboxes() {
      vm.selectedList=null;
      vm.imagelist=[];
    }
    function getItems() {
      vm.items = null;
      console.log("geting items", vm.getPosition().lng);
      search.getItems(vm.getPosition().lat, vm.getPosition().lng, vm.distanceLimit, vm.selectedImages()).$promise.then(
          function(value){
            vm.items=value;
            return value; },
          function(value){
            console.log(value);
            return value; }
        );

      //vm.items = Image.within_range(vm.getPosition(), vm.distanceLimit);
    }
    function setImageContent(dataUri) {
      console.log("setImageContent", dataUri ? dataUri.length : null);
      vm.item.image_content = DataUtils.getContentFromDataUri(dataUri);
    }
    function getOriginAddress() {
      return currentOrigin.getFormattedAddress();
    }
    function getPosition(){
      return currentOrigin.getPosition();
    }
    function clearOrigin() {
      return currentOrigin.clearLocation();
    }
    function changeDistance() {
      currentOrigin.setDistance(vm.distanceLimit);
    }

    function useCurrentLocation() {
      myLocation.getCurrentLocation().then(
        function(location){
          console.log("useCurrentLocation", location);
          currentOrigin.setLocation(location);
          vm.myPositionError=null;
        },
        function(err){
          console.log(err);
          vm.myPositionError=err;
        });
    }








  }
})();
