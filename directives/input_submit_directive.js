(function(){
  'use strict';

  angular.module('twitterApp.directives')
   .directive('onEnter',function() {

    var linkFn = function(scope,element,attrs) {
      element.bind("keypress", function(event) {
        if(event.which === 13) {
          scope.$apply(function() {
            scope.$eval(attrs.onEnter);
          });
          event.preventDefault();
        }
      });
    };

    return {
      link:linkFn
    };
  });

})();
