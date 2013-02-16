'use strict';

/* Controllers */

function EmailController($scope, Email) {
    $scope.email = Email.get();
}
EmailController.$inject = ['$scope', 'Email'];

function FilterController($scope, CustomerFilters, $filter, FilterCounts, FilteredCustomers) {
    $scope.customerFilters = CustomerFilters.query();
    // $scope.filterList = [[{"attribute" : {
    //         "id":"first-name",
    //         "label":"First name",
    //         "operators":["=", "LIKE"],
    //         "type":"string"
    //     }, "operator" : "test", "value" : 47}]];
    $scope.filterList = [[]];

    $scope.refreshQuery = function()
    {
        $scope.counts = FilterCounts.get();
        $scope.customers = FilteredCustomers.query();
    }

    $scope.refreshQuery();

    $scope.SetFilter = function()//todo kam to ma pichnut
    {
        $scope.email.to = $scope.filterList;
    }

    $scope.SetCurrentFilter = function (defaultOperator, defaultValue) {
        if($scope.addCondition=="or")
        {
            $scope.AddOr();
            return;
        }

        // $scope.addCondition = attribute.label;
        $scope.currentFilter = JSON.parse($scope.addCondition);
        $scope.currentFilterProperties = {
            "selectedOperator" : $scope.currentFilter.operators[0],
            "value" : ""
        }
    };

    $scope.ResetFilterForm = function()
    {
        this.addCondition = "";
        this.currentFilter = null;
    }

    $scope.AddFilter = function(attribute, operator, value) {
        this.filterList[$scope.filterList.length-1].push({"attribute" : attribute, "operator" : operator, "value" : value, "editMode": false});

        $scope.ResetFilterForm()
        $scope.refreshQuery();
    };

    $scope.AddOr = function() {
        $scope.filterList.push([]);

        $scope.ResetFilterForm();
        $scope.refreshQuery();
    }

    $scope.RemoveFilter = function(groupIndex, index) {
      if(groupIndex<0 || groupIndex > $scope.filterList.length-1) return;
      if(index<0 || index > $scope.filterList[groupIndex].length-1) return;
      //remove item from list
      $scope.filterList[groupIndex].splice(index,1);
      $scope.refreshQuery();
    };

    $scope.RemoveOr = function(index) {
      //merge lists
      if(index<1 || index>$scope.filterList.length-1) return;
      $scope.filterList.splice(index-1,2,$scope.filterList[index-1].concat($scope.filterList[index]));
      $scope.refreshQuery();
    }

    $scope.MoveFilter = function(groupIndex, index, direction) {
        if(groupIndex<0 || groupIndex > $scope.filterList.length-1) return;
        if(index<0 || index > $scope.filterList[groupIndex].length-1) return;

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
                    $scope.filterList[groupIndex-1].splice($scope.filterList[groupIndex-1].length,0,$scope.filterList[groupIndex][index]);
                    $scope.filterList[groupIndex].splice(index,1);
                }
            }
            else
            {
                   $scope.filterList[groupIndex].splice(index-1,0,$scope.filterList[groupIndex][index]);
                   $scope.filterList[groupIndex].splice(index+1,1);
            }
        }
        $scope.refreshQuery();
    };

    $scope.MoveOr = function(index, direction) {
        if(index<1 || index > $scope.filterList.length-1) return;
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
        // $scope.refreshQuery(); //tu to netreba - vola sa to v move filter
    }

    $scope.SetEditMode = function(item, editMode)
    {
        item.editMode = editMode;
        if(editMode==false)
            $scope.refreshQuery();
    }
}
FilterController.$inject = ['$scope', 'CustomerFilters', '$filter', 'FilterCounts', 'FilteredCustomers'];
