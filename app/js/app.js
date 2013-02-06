'use strict';


// Declare app level module which depends on filters, and services
angular.module('marketingJS', ['myApp.filters', 'marketingjs.services', 'marketingjs.directives', 'ui']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/email', {templateUrl: 'partials/email.html', controller: EmailController});    
    $routeProvider.otherwise({redirectTo: '/email'});
  }]);
