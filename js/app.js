var app = angular.module("showGeometry", []);

app.config([function() {
}]);

app.run(function($rootScope) {

});

app.controller("mapController", ['$scope', function($scope) {
    var imageLayer = null;
    $scope.isBingOpen = false;
    var bboxBrasil = [-8237536, -3210509.3, -3995344, 588319.6];

    $scope.changeBingLayer = function(){
      $scope.isBingOpen = !$scope.isBingOpen;
      bingLayer.setVisible($scope.isBingOpen);
    };
  

    var scaleLineControl = new ol.control.ScaleLine({
      geodesic: true
    });
  
    var controls = ol.control.defaults({
      attributionOptions: {
        collapsible: true
      }
    }).extend([
      scaleLineControl
    ]);
  
    var bingLayer = new ol.layer.Tile({
      source: new ol.source.BingMaps({
        key: 'Aju6M8s8i2z68M1SsotZXEQozjluS0fMx874AKbJYKptLdaIGJXaU9aAyd1xQUWd',
        imagerySet: 'AerialWithLabels'
      }),
      visible: false,
      preload: Infinity
    });
  
    var map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
          crossOrigin: 'anonymous',
          preload: true
        }),
        bingLayer
      ],
      target: 'map',
      controls: controls,
      view: new ol.View({
        center: [0, 0],
        zoom: 3
      })
    });
  
    map.renderSync();
  
    setTimeout(function(){
      map.renderSync();
    }, 100);
  
}]);

app.controller("geometryController", ['$scope', function($scope) {

}]);