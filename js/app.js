var app = angular.module("showGeometry", []);

app.config([function() {
}]);

app.run(function($rootScope) {

});

app.controller("mapController", ['$scope', function($scope) {
    console.log('oi');
    $scope.bingLayerSelected = false;

    addCursorFeature();
  
    var imageLayer = null;
    var bboxBrasil = [-8237536, -3210509.3, -3995344, 588319.6];
  
  
    $scope.centerMap = function() {
      var extent = layerCars.getSource().getExtent();
      if (extent[0] !== Infinity) {
        map.getView().setCenter();
        map.getView().fit(extent, map.getSize());
      }
    };
  
    $scope.downloadImage = function(e) {
      map.once('postcompose', function(event) {
        var canvas = event.context.canvas;
        document.getElementsByClassName('.canvas-image')[0].src = canvas.toDataURL('image/png');
        document.getElementsByClassName('.save-as')[0].href = document.getElementsByClassName('.canvas-image')[0].src;
      });
      map.renderSync();
    };
  
    $scope.changeBingLayer = function(){
      $scope.bingLayerSelected = !$scope.bingLayerSelected;
      $rootScope.$broadcast('home.map-layer', $scope.bingLayerSelected);
      bingLayer.setVisible($scope.bingLayerSelected);
    };

    var centralizarSelecionadoControl = new ol.control.Control({
      className: 'centra-selecionado',
      element: angular.element("#ol-center-map")[0]
    });

    var fitCoordinates = function(wkt) {
      var geomPoint = transformWktToGeomPoint(wkt);
      map.getView().fit(geomPoint, map.getSize());
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
  
    function addCursorFeature() {
      var cursorFeature = new ol.Feature(new ol.geom.Point([0, 0]));
      cursorFeature.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.46, 48],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.95,
          src: '../../img/ponto1.png'
        })
      }));
      new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
          features: [cursorFeature]
        })
      });
      return cursorFeature;
    }
  
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
      map.addControl(centralizarSelecionadoControl);
      map.renderSync();
    }, 100);
  
    $scope.closeLegendPanel = function() {
      $scope.showLegendPanel = false;
    };
  
}]);