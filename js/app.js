var app = angular.module("showGeometry", []);

app.config([function() {
}]);

app.run(function($rootScope) {

});

app.controller("mapController", ['$scope', function($scope) {
    var imageLayer = null;
    $scope.isBingOpen = false;
    $scope.mapAreGray = false;
    $scope.mapAreAlmostGray = false;
    $scope.mapAreThreshold = false;
    $scope.mapAreBlur = false;
    $scope.mapAreClarified = true;
    var bboxBrasil = [-8237536, -3210509.3, -3995344, 588319.6];

    function greyscale(context) {
      var canvas = context.canvas;
      var width = canvas.width;
      var height = canvas.height;
      var imageData = context.getImageData(0, 0, width, height);
      var data = imageData.data;
      for(i=0; i < data.length; i += 4){
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];
        // CIE luminance for the RGB
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        // Show white color instead of black color while loading new tiles:
        if(v === 0.0)
         v=255.0;  
        data[i+0] = v; // Red
        data[i+1] = v; // Green
        data[i+2] = v; // Blue
        data[i+3] = 255; // Alpha
      }
      context.putImageData(imageData,0,0); 
    };

    function almostGray(context) {
      var canvas = context.canvas;
      canvas.getContext('2d').filter = 'grayscale(70%)';
    };

    function threshold(context) {
      var canvas = context.canvas;
      var width = canvas.width;
      var height = canvas.height;
      var imageData = context.getImageData(0, 0, width, height);
      var data = imageData.data;
      for(i=0; i < data.length; i += 4){
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        var v = (0.2126*r + 0.7152*g + 0.0722*b >= 220) ? 255 : 0;
        data[i] = data[i+1] = data[i+2] = v
      }
      context.putImageData(imageData,0,0); 
    }

    $scope.changeBingLayer = function(){
      $scope.isBingOpen = !$scope.isBingOpen;
      bingLayer.setVisible($scope.isBingOpen);
    };

    $scope.clarifyBing = function() {
      $scope.mapAreClarified = !$scope.mapAreClarified;
      console.log('clarified?', $scope.mapAreClarified);
    };

    var blur = function(context) {
      var canvas = context.canvas;
      canvas.getContext('2d').filter = 'blur(5px) opacity(0.6)';
    }

    var clarify = function(context) {
      var canvas = context.canvas;
      canvas.getContext('2d').filter = 'brightness(170%)';
    }

    var normalBrigthness = function(context) {
      var canvas = context.canvas;
      canvas.getContext('2d').filter = 'brightness(100%)';
    }

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
        key: 'ArwEpKxxf_31Uy_9GXxuNrFZWKJgoa_dZk_z-r_c3p0ulsOQKe5azv2zsOkDnMzW',
        imagerySet: 'AerialWithLabels'
      }),
      visible: false,
      preload: Infinity
    });

    var osmLayer = new ol.layer.Tile({
      source: new ol.source.OSM(),
      crossOrigin: 'anonymous',
      preload: true
    });

    osmLayer.on('postcompose', function(event) {
      if ($scope.mapAreGray) greyscale(event.context);
      if ($scope.mapAreThreshold) threshold(event.context);
      if ($scope.mapAreBlur) blur(event.context);
      if ($scope.mapAreAlmostGray) almostGray(event.context);
      if ($scope.mapAreClarified) clarify(event.context);
    });

    bingLayer.on('postcompose', function(event) {
      console.log('really clarified?', $scope.mapAreClarified);
      if ($scope.mapAreGray) greyscale(event.context);
      if ($scope.mapAreThreshold) threshold(event.context);
      if ($scope.mapAreBlur) blur(event.context);
      if ($scope.mapAreClarified) clarify(event.context);
    });
  
    var map = new ol.Map({
      layers: [
        osmLayer,
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
