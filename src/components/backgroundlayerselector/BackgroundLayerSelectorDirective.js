(function() {
  goog.provide('ga_backgroundlayerselector_directive');

  goog.require('ga_map');
  goog.require('ga_permalink');

  var module = angular.module('ga_backgroundlayerselector_directive', [
    'ga_map',
    'ga_permalink'
  ]);

  module.directive('gaBackgroundLayerSelector',
      ['gaPermalink', 'gaLayers',
       function(gaPermalink, gaLayers) {
         return {
           restrict: 'A',
           replace: true,
           scope: {
             map: '=gaBackgroundLayerSelectorMap'
           },
           template:
               '<select ng-model="currentLayer" ' +
                   'ng-options="l.id as l.label | translate for l in ' +
                       'backgroundLayers" class="input-small">' +
               '</select>',
           link: function(scope, element, attrs) {
             var map = scope.map;

             function setCurrentLayer(layerId) {
               var layer = gaLayers.getOlLayerById(layerId);
               map.getLayers().setAt(0, layer);
               gaPermalink.updateParams({bgLayer: layerId});
             }

             scope.$on('gaLayersChange', function(event) {
               scope.backgroundLayers = gaLayers.getBackgroundLayers();
               var queryParams = gaPermalink.getParams();
               scope.currentLayer = (queryParams.bgLayer !== undefined) ?
                   queryParams.bgLayer : scope.backgroundLayers[0].id;
               setCurrentLayer(scope.currentLayer);
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
