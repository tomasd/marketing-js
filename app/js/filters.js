'use strict';

/* Filters */

angular.module('marketingjs.filters', []).
  filter('default', function() {
    return function(value, defaultValue) {
      if(value==null || value==undefined)
      {
      	return defaultValue;
      }
      return value;
    }
  });
