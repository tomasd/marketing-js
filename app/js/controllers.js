'use strict';

/* Controllers */

function EmailCtrl($scope, Email, CustomerFilters) {    
    $scope.email = Email.get();
    $scope.customerFilters = CustomerFilters.query();

    $scope.SetCurrentFilter = function (groupIndex, attributeIndex) {        
        $scope.currentFilter = $scope.customerFilters[groupIndex].attributes[attributeIndex];
        $scope.currentFilter.selectedOperator = $scope.currentFilter.operators[0];
    };
}
EmailCtrl.$inject = ['$scope', 'Email', 'CustomerFilters'];


function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
