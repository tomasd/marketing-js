'use strict';

/* Services */

angular.module('marketingjs.services', ['ngResource']).    
    factory('Email', function($resource){
        return $resource('email.json', {}, {});
    });