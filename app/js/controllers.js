'use strict';

/* Controllers */

function EmailCtrl($scope, Email, CustomerFilters) {    
    $scope.email = Email.get();
    $scope.customerFilters = CustomerFilters.query();
    $scope.filterList = [[]];

    $scope.SetCurrentFilter = function (groupIndex, attributeIndex, defaultOperator, defaultValue) {
        $scope.currentFilter = $scope.customerFilters[groupIndex].attributes[attributeIndex];
        $scope.currentFilterProperties = {
        "selectedOperator" : $scope.currentFilter.operators[0],
        "value" : ""
        }
    };

    $scope.AddFilter = function(attribute, operator, value)
    {
        $scope.filterList[$scope.filterList.length-1].push({"attribute" : attribute, "operator" : operator, "value" : value});
    };
}
EmailCtrl.$inject = ['$scope', 'Email', 'CustomerFilters'];


function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
