'use strict';


// Declare app level module which depends on filters, and services
angular.module('marketingJS', ['myApp.filters', 'marketingjs.services']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/email', {templateUrl: 'partials/email.html', controller: EmailCtrl});
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: MyCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/email'});
  }]);
