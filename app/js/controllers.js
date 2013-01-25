'use strict';

/* Controllers */

function EmailCtrl($scope, Email, CustomerFilters) {    
    $scope.email = Email.get();
    $scope.customerFilters = CustomerFilters.query();
    $scope.filterList = [[]];

    $scope.SetFilter = function()
    {
        $scope.email.to = $scope.filterList;    
    }

    $scope.SetCurrentFilter = function (groupIndex, attributeIndex, defaultOperator, defaultValue) {
        $scope.currentFilter = $scope.customerFilters[groupIndex].attributes[attributeIndex];
        $scope.currentFilterProperties = {
        "selectedOperator" : $scope.currentFilter.operators[0],
        "value" : ""
        }
    };

    $scope.AddFilter = function(attribute, operator, value) {
        $scope.filterList[$scope.filterList.length-1].push({"attribute" : attribute, "operator" : operator, "value" : value});
    };

    $scope.AddOr = function(attribute, operator, value) {
        $scope.filterList.push([]);
    }

    $scope.RemoveFilter = function(groupIndex, index) {
      //remove item from list
      $scope.filterList[groupIndex].splice(index,1);
    };

    $scope.RemoveOr = function(index) {
      //merge lists  
      $scope.filterList.splice(index-1,2,$scope.filterList[index-1].concat($scope.filterList[index]));
    }

    $scope.MoveFilter = function(groupIndex, index, direction) {
        if(direction==1) //down
        {
            if(index == $scope.filterList[groupIndex].length-1)
            {
                if(groupIndex !=$scope.filterList.length-1)
                {
                    $scope.filterList[groupIndex+1].splice(0,0,$scope.filterList[groupIndex][index]);
                    $scope.filterList[groupIndex].splice(index,1);
                }
            }
            else
            {
                   $scope.filterList[groupIndex].splice(index+2,0,$scope.filterList[groupIndex][index]);
                   $scope.filterList[groupIndex].splice(index,1);
            }
            
        }
        else //up
        {
            if(index == 0)
            {
                if(groupIndex != 0)
                {
                    $scope.filterList[groupIndex-1].splice($scope.filterList[groupIndex].length,0,$scope.filterList[groupIndex][index]);
                    $scope.filterList[groupIndex].splice(index,1);
                }
            }
            else
            {
                   $scope.filterList[groupIndex].splice(index-1,0,$scope.filterList[groupIndex][index]);
                   $scope.filterList[groupIndex].splice(index+1,1);
            }
        }
    };

    $scope.MoveOr = function(index, direction) {        
        if(direction==1)
        {            
            if($scope.filterList[index].length>0)
                $scope.MoveFilter(index,0,-1);
        }
        else
        {              
            if($scope.filterList[index-1].length>0)
                $scope.MoveFilter(index-1,$scope.filterList[index-1].length-1,1);
        }
    }
}
EmailCtrl.$inject = ['$scope', 'Email', 'CustomerFilters'];


function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
