'use strict';

/* Directives */


angular.module('marketingjs.directives', []).
  directive('ngEnter', function() {
    return function(scope, elm, attrs) {
        elm.bind('keypress', function(e) {
            if (e.charCode === 13) scope.$apply(attrs.ngEnter);
        });
    };
});    
