(function() {
  goog.provide('ga_backgroundlayerselector_directive');

  goog.require('ga_map');
  goog.require('ga_permalink');

  var module = angular.module('ga_backgroundlayerselector_directive', [
    'ga_map',
    'ga_permalink'
  ]);

  module.directive('gaBackgroundLayerSelector',
      ['gaPermalink', 'gaLayers', '$translate',
       function(gaPermalink, gaLayers, $translate) {
         return {
           restrict: 'A',
           replace: true,
           templateUrl: 'components/backgroundlayerselector/partials/' +
               'backgroundlayerselector.html',
           scope: {
             map: '=gaBackgroundLayerSelectorMap'
           },
           link: function(scope, element, attrs) {
             var map = scope.map;

             function setCurrentLayer(layerId) {
               if (layerId == 'voidLayer') {
                 map.getLayers().removeAt(0);
                 gaPermalink.updateParams({bgLayer: layerId});
               } else {
                 var layer = gaLayers.getOlLayerById(layerId);
                 map.getLayers().setAt(0, layer);
                 gaPermalink.updateParams({bgLayer: layerId});  
               }
             }
             scope.$on('gaLayersChange', function(event, data) {
               gaLayers.getBackgroundLayers().then(function(backgroundLayers) {
                 backgroundLayers.push({
                   id: 'voidLayer',
                   label: $translate('void_layer')
                 });
                 scope.backgroundLayers = backgroundLayers;
                 //console.log(backgroundLayers);
                 var queryParams = gaPermalink.getParams();
                 scope.currentLayer = (queryParams.bgLayer !== undefined) ?
                  queryParams.bgLayer : backgroundLayers[0].id;
                setCurrentLayer(scope.currentLayer);
               });
             });

             scope.$watch('currentLayer', function(newVal, oldVal) {
               if (oldVal !== newVal) {
                 setCurrentLayer(newVal);
               }
             });
           }
         };
       }]);
})();
