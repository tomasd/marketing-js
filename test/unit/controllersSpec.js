'use strict';

/* jasmine specs for controllers go here */
describe('Controllers', function(){

  beforeEach(module('marketingjs.services'));

  describe('FilterController', function(){
    var filterController, scope, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('filters.json').
           respond([{"group" : "CUSTOMER", "attributes":[
              {"id":"first-name","label":"First name","operators":["=", "LIKE"],"type":"string"},
              {"id":"last-name","label":"Last name","operators":["=", "LIKE"],"type":"string"},
              {"id":"email","label":"Email","operators":["=", "LIKE"],"type":"string"},
              {"id":"phone","label":"Phone","operators":["=", "LIKE"],"type":"string"}]}]);
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);

      scope = $rootScope.$new();
      filterController = $controller(FilterController, {$scope: scope});
    }));

    it('should add 4 filters and or after first 3 and at the end to filter list', function() {
      var available_attributes = [
        {"id":"first-name","label":"First name","operators":["=", "LIKE"],"type":"string"},
        {"id":"last-name","label":"Last name","operators":["=", "LIKE"],"type":"string"},
        {"id":"email","label":"Email","operators":["=", "LIKE"],"type":"string"},
        {"id":"phone","label":"Phone","operators":["=", "LIKE"],"type":"string"}
      ];

      $httpBackend.flush();
      expect(scope.filterList.length).toBe(1);
      expect(scope.filterList[0].length).toBe(0);

      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.AddFilter(available_attributes[0],available_attributes[0].operators[0],"aaa");
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.AddFilter(available_attributes[1],available_attributes[0].operators[0],"bbb");
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.AddFilter(available_attributes[2],available_attributes[0].operators[0],"ccc@7segments.com");
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.AddOr();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.AddFilter(available_attributes[3],available_attributes[0].operators[0],"0904742314");
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.AddOr();

      expect(scope.filterList.length).toBe(3);
      expect(scope.filterList[0].length).toBe(3);
      expect(scope.filterList[1].length).toBe(1);
      expect(scope.filterList[2].length).toBe(0);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");
      expect(scope.filterList[0][1].operator).toBe(available_attributes[1].operators[0]);
      expect(scope.filterList[0][2].value).toBe("ccc@7segments.com");
      expect(scope.filterList[1][0].attribute.id).toBe("phone");
      expect(scope.filterList[1][0].value).toBe("0904742314");    
    });
  });

});
