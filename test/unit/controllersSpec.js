'use strict';

Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (var i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};

/* jasmine specs for controllers go here */
describe('Controllers', function(){

  beforeEach(module('marketingjs.services'));

  describe('FilterController', function(){
    var ctrl, scope, $httpBackend;

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
      ctrl = $controller(FilterController, {$scope: scope});
    }));

    it('should add 4 filters and or after first 3 and at the end to filter list', function() {
      $httpBackend.flush();
      var available_attributes = scope.customerFilters[0].attributes;

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

    //todo: test pridania zleho atributu

    it('should remove filter from filterList', function(){
      $httpBackend.flush();
      var fl = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false},
             {"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}]];

      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveFilter(0,0);
      expect(scope.filterList[0].length).toBe(1);
      expect(scope.filterList[0][0].attribute.id).toBe("last-name");

      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveFilter(1,1);
      expect(scope.filterList[1].length).toBe(1);
      expect(scope.filterList[1][0].attribute.id).toBe("email");

      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveFilter(1,0);
      expect(scope.filterList[1].length).toBe(1);
      expect(scope.filterList[1][0].attribute.id).toBe("phone");
    });

    it('should NOT remove filter from filterList', function(){
      $httpBackend.flush();
      var fl = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false}],
            [{"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}],[]];

      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveFilter(4,0);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(1);
      expect(scope.filterList[2].length).toBe(1);
      expect(scope.filterList[3].length).toBe(0);
      expect(scope.filterList[0][1].attribute.id).toBe("last-name");

      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveFilter(0,2);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(1);
      expect(scope.filterList[2].length).toBe(1);
      expect(scope.filterList[3].length).toBe(0);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");

      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveFilter(0,-1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(1);
      expect(scope.filterList[2].length).toBe(1);
      expect(scope.filterList[3].length).toBe(0);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");

      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveFilter(1,1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(1);
      expect(scope.filterList[2].length).toBe(1);
      expect(scope.filterList[3].length).toBe(0);
      expect(scope.filterList[1][0].attribute.id).toBe("email");

      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveFilter(3,0);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(1);
      expect(scope.filterList[2].length).toBe(1);
      expect(scope.filterList[3].length).toBe(0);
      expect(scope.filterList[2][0].attribute.id).toBe("phone");

    });

    it('should remove or from filterList', function(){
      $httpBackend.flush();
      var fl1 = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false},
             {"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}]];

      var fl2 = [[],[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false},
             {"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false},
             {"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}]];

      var fl3 = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false},
             {"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false},
             {"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}],[]];

      scope.filterList = fl1.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveOr(1);
      expect(scope.filterList[0].length).toBe(4);
      expect(scope.filterList[0][2].attribute.id).toBe("email");

      scope.filterList = fl2.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveOr(1);
      expect(scope.filterList[0].length).toBe(4);
      expect(scope.filterList[0][2].attribute.id).toBe("email");

      scope.filterList = fl3.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveOr(1);
      expect(scope.filterList[0].length).toBe(4);
      expect(scope.filterList[0][2].attribute.id).toBe("email");
    });

    it('should remove or from filterList(two consecutive ORs)', function(){
      $httpBackend.flush();
      var fl1 = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
             [],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false},
             {"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}]];

      var fl2 = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
             [],[],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false},
             {"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}]];


      scope.filterList = fl1.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveOr(1);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(2);
      expect(scope.filterList[1][0].attribute.id).toBe("email");

      scope.filterList = fl1.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveOr(2);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(2);
      expect(scope.filterList[1][0].attribute.id).toBe("email");

      scope.filterList = fl2.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveOr(2);
      expect(scope.filterList.length).toBe(3);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(0);
      expect(scope.filterList[2].length).toBe(2);
      expect(scope.filterList[2][0].attribute.id).toBe("email");

      scope.filterList = fl2.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveOr(2);
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveOr(1);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(2);
      expect(scope.filterList[1][0].attribute.id).toBe("email");
    });

    it('should NOT remove or from filterList', function(){
      $httpBackend.flush();
      var fl = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false},
             {"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}]];
      var fl2 =[[]];

      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveOr(0);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(2);
      expect(scope.filterList[1][0].attribute.id).toBe("email");

      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveOr(2);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(2);
      expect(scope.filterList[1][0].attribute.id).toBe("email");

      scope.filterList = fl2.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveOr(0);
      expect(scope.filterList.length).toBe(1);

      scope.filterList = fl2.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.RemoveOr(1);
      expect(scope.filterList.length).toBe(1);

    });

    it('should move filter',function(){
      var fl = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false},
             {"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}]];

      var fl2 = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false},
             {"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}],[]];

      var fl3 = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false}],
            [{"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}],[]];

      var fl4 = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false}],
            [{"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false},
             {"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false}],
            [{"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}],[]];

      //move down in filtergroup
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveFilter(0,0,1);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[0][0].attribute.id).toBe("last-name");

      //move up in filtergroup
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveFilter(1,1,-1);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[1].length).toBe(2);
      expect(scope.filterList[1][1].attribute.id).toBe("email");

      //move down between filtergroups
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveFilter(0,1,1);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[0].length).toBe(1);
      expect(scope.filterList[1].length).toBe(3);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");
      expect(scope.filterList[1][0].attribute.id).toBe("last-name");
      expect(scope.filterList[1][2].attribute.id).toBe("phone");

      //move down between filtergroups
      scope.filterList = fl4.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveFilter(0,0,1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(0);
      expect(scope.filterList[1].length).toBe(3);
      expect(scope.filterList[2].length).toBe(1);
      expect(scope.filterList[1][0].attribute.id).toBe("first-name");
      expect(scope.filterList[1][1].attribute.id).toBe("last-name");
      expect(scope.filterList[1][2].attribute.id).toBe("email");
      expect(scope.filterList[2][0].attribute.id).toBe("phone");

      //move up between filtergroups
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveFilter(1,0,-1);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[0].length).toBe(3);
      expect(scope.filterList[1].length).toBe(1);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");
      expect(scope.filterList[0][2].attribute.id).toBe("email");
      expect(scope.filterList[1][0].attribute.id).toBe("phone");

      //move up between filtergroups
      scope.filterList = fl3.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveFilter(1,0,-1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(3);
      expect(scope.filterList[1].length).toBe(0);
      expect(scope.filterList[2].length).toBe(1);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");
      expect(scope.filterList[0][2].attribute.id).toBe("email");
      expect(scope.filterList[2][0].attribute.id).toBe("phone");

      //move down between filtergroups, to empty filtergroup
      scope.filterList = fl2.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveFilter(1,1,1);
      expect(scope.filterList.length).toBe(3);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(1);
      expect(scope.filterList[2].length).toBe(1);
      expect(scope.filterList[2][0].attribute.id).toBe("phone");

    });

    it('should NOT move filter',function(){
      var fl = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false},
             {"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}]];

      //invalid grpindex
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveFilter(2,0,-1);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");

      //invalid grpindex
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveFilter(-1,0,1);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");

      //invalid index
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveFilter(0,3,-1);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");

      //invalid index
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveFilter(1,-1,1);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");
    });

    it('should NOT move filter',function(){
      var fl = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false},
             {"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}]];

      //move up in filtergroup
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveFilter(0,0,-1);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");

      //move down in filtergroup
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveFilter(1,1,1);
      expect(scope.filterList.length).toBe(2);
      expect(scope.filterList[1].length).toBe(2);
      expect(scope.filterList[1][1].attribute.id).toBe("phone");

    });

    it('should move OR',function(){
      var fl = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false}],
            [{"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}],[]];

      //move down
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveOr(1,1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(3);
      expect(scope.filterList[0][2].attribute.id).toBe("email");

      //move up
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveOr(2,-1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(0);
      expect(scope.filterList[2].length).toBe(2);
      expect(scope.filterList[0][1].attribute.id).toBe("last-name");
      expect(scope.filterList[2][0].attribute.id).toBe("email");

      //move up
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveOr(3,-1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[1].length).toBe(1);
      expect(scope.filterList[2].length).toBe(0);
      expect(scope.filterList[3].length).toBe(1);
      expect(scope.filterList[1][0].attribute.id).toBe("email");
      expect(scope.filterList[3][0].attribute.id).toBe("phone");
    });

    it('should NOT move OR',function(){
      var fl = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false}],
            [{"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}],[]];

      //move down
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveOr(0,1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");

      //move up
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveOr(0,-1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");

      //move down
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveOr(4,1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[3].length).toBe(0);
      expect(scope.filterList[2][0].attribute.id).toBe("phone");

      //move up
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveOr(4,-1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[3].length).toBe(0);
      expect(scope.filterList[2][0].attribute.id).toBe("phone");

    });

    it('should NOT move OR',function(){
      var fl = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false}],
            [{"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}],[]];

      //move down
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveOr(0,1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");

      //move up
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveOr(0,-1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");

      //move down
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveOr(4,1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[3].length).toBe(0);
      expect(scope.filterList[2][0].attribute.id).toBe("phone");

      //move up
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveOr(4,-1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[3].length).toBe(0);
      expect(scope.filterList[2][0].attribute.id).toBe("phone");

    });

    it('should NOT move OR',function(){
      var fl = [[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false}],
            [{"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}],[]];
      var fl2 = [[],[{"attribute":{"id":"first-name","label":"First name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"vsa","editMode":false},
             {"attribute":{"id":"last-name","label":"Last name","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"dsav","editMode":false}],
            [{"attribute":{"id":"email","label":"Email","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"agf@qwer.com","editMode":false}],
            [{"attribute":{"id":"phone","label":"Phone","operators":["=","LIKE"],"type":"string"},"operator":"=","value":"4747474747","editMode":false}]];

      //move down
      scope.filterList = fl.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveOr(3,1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(2);
      expect(scope.filterList[0][0].attribute.id).toBe("first-name");

      //move up
      scope.filterList = fl2.clone();
      $httpBackend.expectGET('counts.json').respond({});
      $httpBackend.expectGET('customers.json').respond([]);
      scope.MoveOr(1,-1);
      expect(scope.filterList.length).toBe(4);
      expect(scope.filterList[0].length).toBe(0);
      expect(scope.filterList[1].length).toBe(2);
      expect(scope.filterList[1][0].attribute.id).toBe("first-name");

    });

  });

});
