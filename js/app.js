var app = angular.module("showGeometry", []);

app.config([function() {
}]);

app.run(function($rootScope) {
  $rootScope.polygonCoordinates = null;
});

app.controller("mapController", ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.isBingOpen = false;

    var bboxBrasil = [-8237536, -3210509.3, -3995344, 588319.6];
    var imageLayer = null;

    $scope.changeBingLayer = function(){
      $scope.isBingOpen = !$scope.isBingOpen;
      bingLayer.setVisible($scope.isBingOpen);
    };

    $scope.clarifyBing = function() {
      $scope.mapAreClarified = !$scope.mapAreClarified;
      console.log('clarified?', $scope.mapAreClarified);
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

    var source = new ol.source.Vector();

    var vector = new ol.layer.Vector({
      source: source,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#ffcc33',
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#ffcc33'
          })
        })
      })
    });

    var sketch;

    var pointerMoveHandler = function(evt) {
      if (evt.dragging) {
        return;
      }
      /** @type {string} */
      var helpMsg = 'Click to start drawing';

      if (sketch) {
        var geom = (sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {
            // do something
        }
      }
    };

    var map = new ol.Map({
      layers: [
        osmLayer,
        bingLayer,
        vector
      ],
      target: 'map',
      controls: controls,
      view: new ol.View({
        center: bboxBrasil,
        zoom: 3
      })
    });

    map.on('pointermove', pointerMoveHandler);

  
    map.renderSync();
  
    setTimeout(function(){
      map.renderSync();
    }, 100);

    function addInteraction() {
      var type = 'Polygon';
      draw = new ol.interaction.Draw({
        source: source,
        type: type,
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 3,
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            })
          })
        })
      });
      map.addInteraction(draw);

      var listener;
      draw.on('drawstart',
          function(evt) {
            sketch = evt.feature;

            listener = sketch.getGeometry().on('change', function(evt) {
              var geom = evt.target;
              if (geom instanceof ol.geom.Polygon) {
                $rootScope.polygonCoordinates = geom.getCoordinates();
              }
            });
          }, this);

      draw.on('drawend',
          function() {
            sketch = null;
          }, this);
    }

    addInteraction();
}]);

app.controller("geometryController", ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.geoJsonGenerated = '';

  $scope.generatePolygonGeoJson = function() {
    $scope.geoJsonGenerated = JSON.stringify({
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": $rootScope.polygonCoordinates
      },
      "properties": {
        "name": "Generated Polygon"
      }
    });
  };
}]);
