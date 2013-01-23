'use strict';

/* Controllers */

function EmailCtrl($scope, Email, CustomerFilters) {    
    $scope.email = Email.get();
    $scope.customerFilters = CustomerFilters.query();
}
EmailCtrl.$inject = ['$scope', 'Email', 'CustomerFilters'];


function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
