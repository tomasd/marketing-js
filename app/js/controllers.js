'use strict';

/* Controllers */

function EmailCtrl($scope, Email) {    
    $scope.email = Email.get();
}
EmailCtrl.$inject = ['$scope', 'Email'];


function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
