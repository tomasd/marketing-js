'use strict';

/* Services */

angular.module('marketingjs.services', ['ngResource']).    
    factory('Email', function($resource){
        return $resource('email.json', {}, {});
    }).
    factory('CustomerFilters', function($resource){
        return $resource('filters.json', {}, {});
    }).
    factory('FilterCounts', function($resource){
        return $resource('counts.json', {}, {});
    }).
    factory('FilteredCustomers', function($resource){
        return $resource('customers.json', {}, {});
    });
